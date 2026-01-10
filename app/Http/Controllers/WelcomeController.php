<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\Offer;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Fortify\Features;

class WelcomeController extends Controller
{
    /**
     * Display the welcome/homepage.
     */
    public function __invoke(Request $request): Response
    {
        return Inertia::render('welcome', [
            'featuredOffers' => Offer::query()
                ->where('is_active', true)
                ->with('company:id,name,logo_path,sector,city')
                ->latest()
                ->take(6)
                ->get([
                    'id',
                    'company_id',
                    'slug',
                    'title',
                    'location',
                    'work_mode',
                    'salary_range',
                    'type',
                    'experience_level',
                    'is_urgent',
                    'deadline',
                    'created_at',
                ]),
            'stats' => [
                'totalOffers' => Offer::where('is_active', true)->count(),
                'totalCompanies' => Company::where('is_verified', true)->count(),
            ],
            'canRegister' => Features::enabled(Features::registration()),
        ]);
    }
}
