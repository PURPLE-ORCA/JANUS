<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Collection;

class UserApprovalService
{
    /**
     * Approve a user.
     */
    public function approve(User $user): User
    {
        if ($user->status === 'active') {
            return $user;
        }

        $user->update(['status' => 'active']);

        // TODO: Dispatch WelcomeEmail job when email notifications are implemented

        return $user;
    }

    /**
     * Reject a user.
     */
    public function reject(User $user, ?string $reason = null): User
    {
        if ($user->status === 'rejected') {
            return $user;
        }

        $user->update(['status' => 'rejected']);

        // TODO: Dispatch RejectionEmail job when email notifications are implemented

        return $user;
    }

    /**
     * Bulk approve users.
     */
    public function bulkApprove(array $userIds): int
    {
        return User::whereIn('id', $userIds)
            ->where('status', 'pending')
            ->update(['status' => 'active']);
    }

    /**
     * Bulk reject users.
     */
    public function bulkReject(array $userIds): int
    {
        return User::whereIn('id', $userIds)
            ->where('status', 'pending')
            ->update(['status' => 'rejected']);
    }

    /**
     * Get pending users count.
     */
    public function getPendingCount(): int
    {
        return User::where('status', 'pending')->count();
    }

    /**
     * Get pending users.
     */
    public function getPendingUsers(int $limit = 10): Collection
    {
        return User::where('status', 'pending')
            ->latest()
            ->take($limit)
            ->get(['id', 'name', 'email', 'created_at']);
    }

    /**
     * Check if user needs approval.
     */
    public function needsApproval(User $user): bool
    {
        return $user->status === 'pending';
    }

    /**
     * Check if user is rejected.
     */
    public function isRejected(User $user): bool
    {
        return $user->status === 'rejected';
    }
}
