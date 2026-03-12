<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\Company;
use App\Models\Offer;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the admin dashboard.
     */
    public function __invoke(Request $request): Response
    {
        return Inertia::render('admin/index', [
            'stats' => [
                'totalUsers' => User::where('role', 'candidate')->count(),
                'pendingApprovals' => User::where('status', 'pending')->count(),
                'activeOffers' => Offer::where('is_active', true)->count(),
                'totalApplications' => Application::count(),
                'newApplications' => Application::where('status', 'new')->count(),
                'totalCompanies' => Company::count(),
                'verifiedCompanies' => Company::where('is_verified', true)->count(),
                'urgentOffers' => Offer::where('is_active', true)->where('is_urgent', true)->count(),
                'interviewsScheduled' => Application::where('status', 'interview')->count(),
            ],
            'recentApplications' => Application::with([
                    'user:id,name,email',
                    'offer:id,slug,title,company_id',
                    'offer.company:id,name',
                ])
                ->latest()
                ->take(10)
                ->get(['id', 'user_id', 'offer_id', 'status', 'created_at']),
            'pendingUsers' => User::where('status', 'pending')
                ->latest()
                ->take(5)
                ->get(['id', 'name', 'email', 'created_at']),
        ]);
    }
}
