<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\ApplicationNote;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ApplicationController extends Controller
{
    /**
     * Display a listing of applications.
     */
    public function index(Request $request): Response
    {
        $query = Application::query()
            ->with([
                'user:id,name,email',
                'offer:id,slug,title,company_id',
                'offer.company:id,name',
            ]);

        // Status filter
        if ($status = $request->get('status')) {
            $query->where('status', $status);
        }

        // Offer filter
        if ($offerId = $request->get('offer_id')) {
            $query->where('offer_id', $offerId);
        }

        // Search filter (by candidate name/email)
        if ($search = $request->get('search')) {
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'ilike', "%{$search}%")
                    ->orWhere('email', 'ilike', "%{$search}%");
            });
        }

        $applications = $query
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('admin/applications/index', [
            'applications' => $applications,
            'filters' => [
                'status' => $request->get('status'),
                'offer_id' => $request->get('offer_id'),
                'search' => $request->get('search'),
            ],
            'stats' => [
                'total' => Application::count(),
                'new' => Application::where('status', 'new')->count(),
                'shortlisted' => Application::where('status', 'shortlisted')->count(),
                'interview' => Application::where('status', 'interview')->count(),
                'offered' => Application::where('status', 'offered')->count(),
                'rejected' => Application::where('status', 'rejected')->count(),
            ],
        ]);
    }

    /**
     * Display a specific application.
     */
    public function show(Application $application): Response
    {
        $application->load([
            'user.profile.education',
            'user.profile.experience',
            'user.profile.languages',
            'offer:id,slug,title,description,company_id',
            'offer.company:id,name,logo_path',
            'offer.screenerQuestions',
            'notes' => fn ($q) => $q->with('user:id,name')->latest(),
        ]);

        return Inertia::render('admin/applications/show', [
            'application' => $application,
        ]);
    }

    /**
     * Update application status.
     */
    public function updateStatus(Request $request, Application $application): RedirectResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'string', 'in:new,viewed,shortlisted,interview,offered,rejected,hired'],
            'rejection_reason' => ['nullable', 'string', 'max:500'],
        ]);

        $application->update([
            'status' => $validated['status'],
            'rejection_reason' => $validated['rejection_reason'] ?? $application->rejection_reason,
        ]);

        // TODO: Send notification to candidate about status change

        return back()->with('success', 'Statut mis à jour.');
    }

    /**
     * Schedule an interview.
     */
    public function scheduleInterview(Request $request, Application $application): RedirectResponse
    {
        $validated = $request->validate([
            'interview_at' => ['required', 'date', 'after:now'],
        ]);

        $application->update([
            'status' => 'interview',
            'interview_at' => $validated['interview_at'],
        ]);

        // TODO: Send interview notification to candidate

        return back()->with('success', 'Entretien programmé.');
    }

    /**
     * Add a recruiter note.
     */
    public function addNote(Request $request, Application $application): RedirectResponse
    {
        $validated = $request->validate([
            'note' => ['required', 'string', 'max:1000'],
        ]);

        ApplicationNote::create([
            'application_id' => $application->id,
            'user_id' => $request->user()->id,
            'note' => $validated['note'],
        ]);

        return back()->with('success', 'Note ajoutée.');
    }

    /**
     * Bulk update application status.
     */
    public function bulkUpdateStatus(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'application_ids' => ['required', 'array'],
            'application_ids.*' => ['exists:applications,id'],
            'status' => ['required', 'string', 'in:viewed,shortlisted,rejected'],
        ]);

        Application::whereIn('id', $validated['application_ids'])
            ->update(['status' => $validated['status']]);

        return back()->with('success', count($validated['application_ids']) . ' candidature(s) mise(s) à jour.');
    }
}
