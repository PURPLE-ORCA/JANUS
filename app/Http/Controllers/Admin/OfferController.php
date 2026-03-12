<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\Offer;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class OfferController extends Controller
{
    /**
     * Display a listing of offers.
     */
    public function index(Request $request): Response
    {
        $query = Offer::query()->with('company:id,name,logo_path');

        // Search filter
        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'ilike', "%{$search}%")
                    ->orWhere('description', 'ilike', "%{$search}%");
            });
        }

        // Status filter
        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        // Company filter
        if ($companyId = $request->get('company_id')) {
            $query->where('company_id', $companyId);
        }

        $offers = $query
            ->withCount('applications')
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('admin/offers/index', [
            'offers' => $offers,
            'companies' => Company::orderBy('name')->get(['id', 'name']),
            'filters' => [
                'search' => $request->get('search'),
                'is_active' => $request->get('is_active'),
                'company_id' => $request->get('company_id'),
            ],
        ]);
    }

    /**
     * Show the form for creating a new offer.
     */
    public function create(): Response
    {
        return Inertia::render('admin/offers/create', [
            'companies' => Company::where('is_verified', true)->orderBy('name')->get(['id', 'name']),
        ]);
    }

    /**
     * Store a newly created offer.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'company_id' => ['required', 'exists:companies,id'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'location' => ['required', 'string', 'max:100'],
            'work_mode' => ['required', 'string', 'in:onsite,remote,hybrid'],
            'salary_range' => ['nullable', 'string', 'max:50'],
            'type' => ['required', 'string', 'in:full-time,part-time,freelance,internship'],
            'experience_level' => ['required', 'string', 'in:junior,mid,senior,lead'],
            'education_required' => ['nullable', 'string', 'in:none,bac,bac+2,bac+3,bac+5'],
            'languages_required' => ['nullable', 'array'],
            'benefits' => ['nullable', 'array'],
            'positions_count' => ['nullable', 'integer', 'min:1'],
            'is_urgent' => ['boolean'],
            'is_active' => ['boolean'],
            'deadline' => ['nullable', 'date', 'after:today'],
        ]);

        // Generate unique slug
        $slug = $this->generateUniqueSlug($validated['title']);
        $validated['slug'] = $slug;
        $validated['views_count'] = 0;

        $offer = Offer::create($validated);

        return redirect()
            ->route('admin.offers.index')
            ->with('success', 'Offre créée avec succès.');
    }

    /**
     * Show the form for editing an offer.
     */
    public function edit(string $slug): Response
    {
        $offer = Offer::where('slug', $slug)
            ->with('screenerQuestions')
            ->firstOrFail();

        return Inertia::render('admin/offers/edit', [
            'offer' => $offer,
            'companies' => Company::where('is_verified', true)->orderBy('name')->get(['id', 'name']),
        ]);
    }

    /**
     * Update the specified offer.
     */
    public function update(Request $request, string $slug): RedirectResponse
    {
        $offer = Offer::where('slug', $slug)->firstOrFail();

        $validated = $request->validate([
            'company_id' => ['required', 'exists:companies,id'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'location' => ['required', 'string', 'max:100'],
            'work_mode' => ['required', 'string', 'in:onsite,remote,hybrid'],
            'salary_range' => ['nullable', 'string', 'max:50'],
            'type' => ['required', 'string', 'in:full-time,part-time,freelance,internship'],
            'experience_level' => ['required', 'string', 'in:junior,mid,senior,lead'],
            'education_required' => ['nullable', 'string', 'in:none,bac,bac+2,bac+3,bac+5'],
            'languages_required' => ['nullable', 'array'],
            'benefits' => ['nullable', 'array'],
            'positions_count' => ['nullable', 'integer', 'min:1'],
            'is_urgent' => ['boolean'],
            'is_active' => ['boolean'],
            'deadline' => ['nullable', 'date'],
        ]);

        // Only regenerate slug if title changed
        if ($offer->title !== $validated['title']) {
            $validated['slug'] = $this->generateUniqueSlug($validated['title'], $offer->id);
        }

        $offer->update($validated);

        return redirect()
            ->route('admin.offers.index')
            ->with('success', 'Offre mise à jour avec succès.');
    }

    /**
     * Remove the specified offer.
     */
    public function destroy(string $slug): RedirectResponse
    {
        $offer = Offer::where('slug', $slug)->firstOrFail();

        // Check if offer has applications
        if ($offer->applications()->exists()) {
            return back()->with('error', 'Impossible de supprimer une offre ayant des candidatures.');
        }

        $offer->delete();

        return redirect()
            ->route('admin.offers.index')
            ->with('success', 'Offre supprimée.');
    }

    /**
     * Toggle offer active status.
     */
    public function toggleActive(string $slug): RedirectResponse
    {
        $offer = Offer::where('slug', $slug)->firstOrFail();
        $offer->update(['is_active' => !$offer->is_active]);

        $status = $offer->is_active ? 'activée' : 'désactivée';

        return back()->with('success', "Offre {$status}.");
    }

    /**
     * Generate a unique slug.
     */
    private function generateUniqueSlug(string $title, ?int $excludeId = null): string
    {
        $slug = Str::slug($title);
        $originalSlug = $slug;
        $count = 1;

        while (
            Offer::where('slug', $slug)
                ->when($excludeId, fn ($q) => $q->where('id', '!=', $excludeId))
                ->exists()
        ) {
            $slug = "{$originalSlug}-{$count}";
            $count++;
        }

        return $slug;
    }
}
