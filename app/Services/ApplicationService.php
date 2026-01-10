<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Application;
use App\Models\Offer;
use App\Models\User;
use Illuminate\Validation\ValidationException;

class ApplicationService
{
    /**
     * Valid status transitions.
     */
    private const STATUS_TRANSITIONS = [
        'new' => ['viewed', 'shortlisted', 'rejected', 'withdrawn'],
        'viewed' => ['shortlisted', 'rejected', 'withdrawn'],
        'shortlisted' => ['interview', 'rejected', 'withdrawn'],
        'interview' => ['offered', 'rejected', 'withdrawn'],
        'offered' => ['hired', 'rejected', 'withdrawn'],
        'rejected' => [],
        'hired' => [],
        'withdrawn' => [],
    ];

    /**
     * Submit a new application.
     *
     * @throws ValidationException
     */
    public function submit(User $user, Offer $offer, ?string $coverNote = null, ?array $screenerResponses = null): Application
    {
        // Validate user can apply
        $this->validateCanApply($user, $offer);

        return Application::create([
            'user_id' => $user->id,
            'offer_id' => $offer->id,
            'status' => 'new',
            'cover_note' => $coverNote,
            'screener_responses' => $screenerResponses,
        ]);
    }

    /**
     * Validate that a user can apply to an offer.
     *
     * @throws ValidationException
     */
    public function validateCanApply(User $user, Offer $offer): void
    {
        // Check if already applied
        $exists = Application::where('user_id', $user->id)
            ->where('offer_id', $offer->id)
            ->exists();

        if ($exists) {
            throw ValidationException::withMessages([
                'offer_id' => 'Vous avez déjà postulé à cette offre.',
            ]);
        }

        // Check if offer is active
        if (!$offer->is_active) {
            throw ValidationException::withMessages([
                'offer_id' => 'Cette offre n\'est plus disponible.',
            ]);
        }

        // Check if user is active
        if ($user->status !== 'active') {
            throw ValidationException::withMessages([
                'user_id' => 'Votre compte doit être approuvé pour postuler.',
            ]);
        }
    }

    /**
     * Withdraw an application.
     *
     * @throws ValidationException
     */
    public function withdraw(Application $application, User $user): Application
    {
        // Verify ownership
        if ($application->user_id !== $user->id) {
            throw ValidationException::withMessages([
                'application_id' => 'Vous ne pouvez pas retirer cette candidature.',
            ]);
        }

        // Check if can be withdrawn
        if (!$this->canTransitionTo($application->status, 'withdrawn')) {
            throw ValidationException::withMessages([
                'status' => 'Cette candidature ne peut plus être retirée.',
            ]);
        }

        $application->update(['status' => 'withdrawn']);

        return $application;
    }

    /**
     * Update application status (admin).
     *
     * @throws ValidationException
     */
    public function updateStatus(Application $application, string $newStatus, ?string $rejectionReason = null): Application
    {
        if (!$this->canTransitionTo($application->status, $newStatus)) {
            throw ValidationException::withMessages([
                'status' => "Transition de '{$application->status}' vers '{$newStatus}' non autorisée.",
            ]);
        }

        $data = ['status' => $newStatus];

        if ($newStatus === 'rejected' && $rejectionReason) {
            $data['rejection_reason'] = $rejectionReason;
        }

        $application->update($data);

        return $application;
    }

    /**
     * Schedule an interview.
     */
    public function scheduleInterview(Application $application, \DateTimeInterface $interviewAt): Application
    {
        $application->update([
            'status' => 'interview',
            'interview_at' => $interviewAt,
        ]);

        return $application;
    }

    /**
     * Check if a status transition is valid.
     */
    public function canTransitionTo(string $currentStatus, string $newStatus): bool
    {
        return in_array($newStatus, self::STATUS_TRANSITIONS[$currentStatus] ?? []);
    }

    /**
     * Get valid next statuses for an application.
     */
    public function getValidTransitions(string $currentStatus): array
    {
        return self::STATUS_TRANSITIONS[$currentStatus] ?? [];
    }
}
