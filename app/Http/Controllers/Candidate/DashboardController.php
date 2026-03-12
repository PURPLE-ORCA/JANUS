<?php

declare(strict_types=1);

namespace App\Http\Controllers\Candidate;

use App\Http\Controllers\Controller;
use App\Services\ProfileStrengthService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(
        private readonly ProfileStrengthService $profileStrengthService,
    ) {}

    /**
     * Display the candidate dashboard.
     */
    public function __invoke(Request $request): Response
    {
        $user = $request->user();
        $profile = $user->profile;

        return Inertia::render('dashboard', [
            'stats' => [
                'totalApplications' => $user->applications()->count(),
                'shortlisted' => $user->applications()->where('status', 'shortlisted')->count(),
                'interviews' => $user->applications()->where('status', 'interview')->count(),
                'offered' => $user->applications()->where('status', 'offered')->count(),
            ],
            'recentApplications' => $user->applications()
                ->with(['offer:id,slug,title,location,type,company_id', 'offer.company:id,name,logo_path'])
                ->latest()
                ->take(5)
                ->get(['id', 'offer_id', 'status', 'created_at']),
            'upcomingInterviews' => $user->applications()
                ->where('status', 'interview')
                ->whereNotNull('interview_at')
                ->where('interview_at', '>', now())
                ->with(['offer:id,slug,title,company_id', 'offer.company:id,name,logo_path'])
                ->orderBy('interview_at')
                ->get(['id', 'offer_id', 'status', 'interview_at']),
            'profileStrength' => $this->profileStrengthService->calculate($profile),
        ]);
    }
}
