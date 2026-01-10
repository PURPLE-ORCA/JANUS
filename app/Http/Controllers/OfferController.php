<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Offer;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OfferController extends Controller
{
    /**
     * Display a listing of offers with filters.
     */
    public function index(Request $request): Response
    {
        $query = Offer::query()
            ->where('is_active', true)
            ->with('company:id,name,logo_path,sector,city');

        // Search filter
        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'ilike', "%{$search}%")
                    ->orWhere('description', 'ilike', "%{$search}%");
            });
        }

        // Type filter (full-time, part-time, freelance, internship)
        if ($type = $request->get('type')) {
            $query->where('type', $type);
        }

        // Location filter
        if ($location = $request->get('location')) {
            $query->where('location', 'ilike', "%{$location}%");
        }

        // Work mode filter (onsite, remote, hybrid)
        if ($workMode = $request->get('work_mode')) {
            $query->where('work_mode', $workMode);
        }

        // Experience level filter
        if ($experienceLevel = $request->get('experience_level')) {
            $query->where('experience_level', $experienceLevel);
        }

        // Sector filter (via company)
        if ($sector = $request->get('sector')) {
            $query->whereHas('company', fn ($q) => $q->where('sector', $sector));
        }

        // Urgent filter
        if ($request->boolean('is_urgent')) {
            $query->where('is_urgent', true);
        }

        // Company filter
        if ($companyId = $request->get('company_id')) {
            $query->where('company_id', $companyId);
        }

        // Sorting
        $sortBy = $request->get('sort', 'latest');
        match ($sortBy) {
            'oldest' => $query->oldest(),
            'deadline' => $query->orderBy('deadline', 'asc'),
            default => $query->latest(),
        };

        $offers = $query->paginate(12)->withQueryString();

        return Inertia::render('offers/index', [
            'offers' => $offers,
            'filters' => [
                'search' => $request->get('search'),
                'type' => $request->get('type'),
                'location' => $request->get('location'),
                'work_mode' => $request->get('work_mode'),
                'experience_level' => $request->get('experience_level'),
                'sector' => $request->get('sector'),
                'is_urgent' => $request->boolean('is_urgent'),
                'sort' => $sortBy,
            ],
        ]);
    }

    /**
     * Display the specified offer.
     */
    public function show(string $slug): Response
    {
        $offer = Offer::query()
            ->where('slug', $slug)
            ->where('is_active', true)
            ->with([
                'company:id,name,logo_path,sector,city,website_url,description,is_verified',
                'screenerQuestions' => fn ($q) => $q->orderBy('order'),
            ])
            ->firstOrFail();

        // Increment views count
        $offer->increment('views_count');

        // Check if current user has already applied
        $hasApplied = false;
        $canApply = false;

        if ($user = request()->user()) {
            $hasApplied = $offer->applications()
                ->where('user_id', $user->id)
                ->exists();

            // User can apply if they haven't already and have an active account
            $canApply = !$hasApplied && $user->status === 'active';
        }

        return Inertia::render('offers/show', [
            'offer' => $offer,
            'hasApplied' => $hasApplied,
            'canApply' => $canApply,
        ]);
    }
}
