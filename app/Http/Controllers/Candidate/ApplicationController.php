<?php

declare(strict_types=1);

namespace App\Http\Controllers\Candidate;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\Offer;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class ApplicationController extends Controller
{
    /**
     * Display a listing of the user's applications.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        $query = $user->applications()
            ->with([
                'offer:id,slug,title,location,type,work_mode,company_id,deadline',
                'offer.company:id,name,logo_path',
            ]);

        // Status filter
        if ($status = $request->get('status')) {
            $query->where('status', $status);
        }

        $applications = $query
            ->latest()
            ->paginate(10)
            ->withQueryString();

        // Calculate stats
        $stats = [
            'total' => $user->applications()->count(),
            'new' => $user->applications()->where('status', 'new')->count(),
            'viewed' => $user->applications()->where('status', 'viewed')->count(),
            'shortlisted' => $user->applications()->where('status', 'shortlisted')->count(),
            'interview' => $user->applications()->where('status', 'interview')->count(),
            'offered' => $user->applications()->where('status', 'offered')->count(),
            'rejected' => $user->applications()->where('status', 'rejected')->count(),
        ];

        return Inertia::render('applications/index', [
            'applications' => $applications,
            'stats' => $stats,
            'filters' => [
                'status' => $request->get('status'),
            ],
        ]);
    }

    /**
     * Store a new application.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'offer_id' => ['required', 'exists:offers,id'],
            'cover_note' => ['nullable', 'string', 'max:2000'],
            'screener_responses' => ['nullable', 'array'],
        ]);

        $user = $request->user();
        $offer = Offer::findOrFail($validated['offer_id']);

        // Check if user has already applied
        $existingApplication = Application::where('user_id', $user->id)
            ->where('offer_id', $offer->id)
            ->exists();

        if ($existingApplication) {
            throw ValidationException::withMessages([
                'offer_id' => 'Vous avez déjà postulé à cette offre.',
            ]);
        }

        // Check if offer is still active
        if (!$offer->is_active) {
            throw ValidationException::withMessages([
                'offer_id' => 'Cette offre n\'est plus disponible.',
            ]);
        }

        // Check if user has a resume (recommended but not required)
        $profile = $user->profile;

        // Create application
        $application = Application::create([
            'user_id' => $user->id,
            'offer_id' => $offer->id,
            'status' => 'new',
            'cover_note' => $validated['cover_note'] ?? null,
            'screener_responses' => $validated['screener_responses'] ?? null,
        ]);

        return redirect()
            ->route('applications.index')
            ->with('success', 'Candidature envoyée avec succès!');
    }

    /**
     * Withdraw an application.
     */
    public function withdraw(Request $request, Application $application): RedirectResponse
    {
        $user = $request->user();

        // Ensure user owns this application
        if ($application->user_id !== $user->id) {
            abort(403, 'Vous ne pouvez pas retirer cette candidature.');
        }

        // Can only withdraw if not already in final states
        $finalStatuses = ['hired', 'rejected', 'withdrawn'];
        if (in_array($application->status, $finalStatuses)) {
            return back()->with('error', 'Cette candidature ne peut plus être retirée.');
        }

        $application->update(['status' => 'withdrawn']);

        return back()->with('success', 'Candidature retirée.');
    }
}
