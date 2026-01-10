<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    /**
     * Display a listing of users.
     */
    public function index(Request $request): Response
    {
        $query = User::query()->where('role', 'candidate');

        // Search filter
        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'ilike', "%{$search}%")
                    ->orWhere('email', 'ilike', "%{$search}%");
            });
        }

        // Status filter
        if ($status = $request->get('status')) {
            $query->where('status', $status);
        }

        $users = $query
            ->withCount('applications')
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('admin/users/index', [
            'users' => $users,
            'filters' => [
                'search' => $request->get('search'),
                'status' => $request->get('status'),
            ],
            'stats' => [
                'total' => User::where('role', 'candidate')->count(),
                'pending' => User::where('role', 'candidate')->where('status', 'pending')->count(),
                'active' => User::where('role', 'candidate')->where('status', 'active')->count(),
                'rejected' => User::where('role', 'candidate')->where('status', 'rejected')->count(),
            ],
        ]);
    }

    /**
     * Display a specific user.
     */
    public function show(User $user): Response
    {
        $user->load([
            'profile.education',
            'profile.experience',
            'profile.languages',
            'applications' => fn ($q) => $q->with('offer:id,slug,title,company_id', 'offer.company:id,name')->latest(),
        ]);

        return Inertia::render('admin/users/show', [
            'user' => $user,
        ]);
    }

    /**
     * Approve a user.
     */
    public function approve(User $user): RedirectResponse
    {
        if ($user->status === 'active') {
            return back()->with('info', 'Cet utilisateur est déjà actif.');
        }

        $user->update(['status' => 'active']);

        // TODO: Send welcome email notification

        return back()->with('success', 'Utilisateur approuvé avec succès.');
    }

    /**
     * Reject a user.
     */
    public function reject(Request $request, User $user): RedirectResponse
    {
        if ($user->status === 'rejected') {
            return back()->with('info', 'Cet utilisateur est déjà rejeté.');
        }

        $user->update(['status' => 'rejected']);

        // TODO: Send rejection email notification

        return back()->with('success', 'Utilisateur rejeté.');
    }

    /**
     * Bulk approve users.
     */
    public function bulkApprove(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'user_ids' => ['required', 'array'],
            'user_ids.*' => ['exists:users,id'],
        ]);

        User::whereIn('id', $validated['user_ids'])
            ->where('status', 'pending')
            ->update(['status' => 'active']);

        return back()->with('success', count($validated['user_ids']) . ' utilisateur(s) approuvé(s).');
    }

    /**
     * Bulk reject users.
     */
    public function bulkReject(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'user_ids' => ['required', 'array'],
            'user_ids.*' => ['exists:users,id'],
        ]);

        User::whereIn('id', $validated['user_ids'])
            ->where('status', 'pending')
            ->update(['status' => 'rejected']);

        return back()->with('success', count($validated['user_ids']) . ' utilisateur(s) rejeté(s).');
    }
}
