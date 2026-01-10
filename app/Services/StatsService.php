<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Application;
use App\Models\Company;
use App\Models\Offer;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class StatsService
{
    /**
     * Get admin dashboard stats.
     */
    public function getAdminDashboardStats(): array
    {
        return [
            'users' => [
                'total' => User::where('role', 'candidate')->count(),
                'pending' => User::where('status', 'pending')->count(),
                'active' => User::where('role', 'candidate')->where('status', 'active')->count(),
                'rejected' => User::where('role', 'candidate')->where('status', 'rejected')->count(),
            ],
            'offers' => [
                'total' => Offer::count(),
                'active' => Offer::where('is_active', true)->count(),
                'urgent' => Offer::where('is_active', true)->where('is_urgent', true)->count(),
            ],
            'applications' => [
                'total' => Application::count(),
                'new' => Application::where('status', 'new')->count(),
                'shortlisted' => Application::where('status', 'shortlisted')->count(),
                'interview' => Application::where('status', 'interview')->count(),
                'offered' => Application::where('status', 'offered')->count(),
                'hired' => Application::where('status', 'hired')->count(),
                'rejected' => Application::where('status', 'rejected')->count(),
            ],
            'companies' => [
                'total' => Company::count(),
                'verified' => Company::where('is_verified', true)->count(),
            ],
        ];
    }

    /**
     * Get candidate dashboard stats.
     */
    public function getCandidateDashboardStats(User $user): array
    {
        return [
            'totalApplications' => $user->applications()->count(),
            'viewed' => $user->applications()->where('status', 'viewed')->count(),
            'shortlisted' => $user->applications()->where('status', 'shortlisted')->count(),
            'interview' => $user->applications()->where('status', 'interview')->count(),
            'offered' => $user->applications()->where('status', 'offered')->count(),
            'rejected' => $user->applications()->where('status', 'rejected')->count(),
        ];
    }

    /**
     * Get public homepage stats.
     */
    public function getPublicStats(): array
    {
        return [
            'totalOffers' => Offer::where('is_active', true)->count(),
            'totalCompanies' => Company::where('is_verified', true)->count(),
            'totalCandidates' => User::where('role', 'candidate')->where('status', 'active')->count(),
        ];
    }

    /**
     * Get applications by status distribution.
     */
    public function getApplicationStatusDistribution(): array
    {
        return Application::query()
            ->select('status', DB::raw('COUNT(*) as count'))
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();
    }

    /**
     * Get applications trend (daily for last 30 days).
     */
    public function getApplicationsTrend(int $days = 30): array
    {
        return Application::query()
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('COUNT(*) as count'))
            ->where('created_at', '>=', now()->subDays($days))
            ->groupBy(DB::raw('DATE(created_at)'))
            ->orderBy('date')
            ->pluck('count', 'date')
            ->toArray();
    }

    /**
     * Get top companies by applications.
     */
    public function getTopCompaniesByApplications(int $limit = 5): array
    {
        return Company::query()
            ->select('companies.id', 'companies.name')
            ->selectRaw('COUNT(applications.id) as applications_count')
            ->join('offers', 'companies.id', '=', 'offers.company_id')
            ->join('applications', 'offers.id', '=', 'applications.offer_id')
            ->groupBy('companies.id', 'companies.name')
            ->orderByDesc('applications_count')
            ->limit($limit)
            ->get()
            ->toArray();
    }

    /**
     * Get top offers by applications.
     */
    public function getTopOffersByApplications(int $limit = 5): array
    {
        return Offer::query()
            ->select('id', 'title', 'slug')
            ->withCount('applications')
            ->orderByDesc('applications_count')
            ->limit($limit)
            ->get()
            ->toArray();
    }
}
