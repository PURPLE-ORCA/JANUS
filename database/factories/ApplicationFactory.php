<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Application;
use App\Models\Offer;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Application>
 */
class ApplicationFactory extends Factory
{
    protected $model = Application::class;

    /**
     * Application statuses with realistic distribution weights.
     */
    private const STATUSES = [
        'new' => 25,
        'viewed' => 20,
        'shortlisted' => 15,
        'interview' => 15,
        'offered' => 5,
        'rejected' => 15,
        'hired' => 3,
        'withdrawn' => 2,
    ];

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $status = $this->weightedRandomStatus();
        $interviewAt = null;
        $rejectionReason = null;

        // Set interview date for interview status
        if ($status === 'interview') {
            $interviewAt = fake()->dateTimeBetween('now', '+2 weeks');
        }

        // Set rejection reason for rejected status
        if ($status === 'rejected') {
            $rejectionReason = fake()->optional(0.7)->randomElement([
                'Profil ne correspond pas aux exigences',
                'Expérience insuffisante',
                'Compétences techniques manquantes',
                'Offre pourvue',
                'Candidat surqualifié',
            ]);
        }

        return [
            'user_id' => User::factory(),
            'offer_id' => Offer::factory(),
            'status' => $status,
            'cover_note' => fake()->optional(0.6)->paragraphs(2, true),
            'screener_responses' => null,
            'rejection_reason' => $rejectionReason,
            'interview_at' => $interviewAt,
        ];
    }

    /**
     * Get a weighted random status.
     */
    private function weightedRandomStatus(): string
    {
        $total = array_sum(self::STATUSES);
        $random = fake()->numberBetween(1, $total);
        $cumulative = 0;

        foreach (self::STATUSES as $status => $weight) {
            $cumulative += $weight;
            if ($random <= $cumulative) {
                return $status;
            }
        }

        return 'new';
    }

    /**
     * Create a new application.
     */
    public function new(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'new',
            'interview_at' => null,
            'rejection_reason' => null,
        ]);
    }

    /**
     * Create a shortlisted application.
     */
    public function shortlisted(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'shortlisted',
        ]);
    }

    /**
     * Create an application with scheduled interview.
     */
    public function interview(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'interview',
            'interview_at' => fake()->dateTimeBetween('now', '+2 weeks'),
        ]);
    }

    /**
     * Create a rejected application.
     */
    public function rejected(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'rejected',
            'rejection_reason' => 'Profil ne correspond pas aux exigences',
        ]);
    }

    /**
     * Create a hired application.
     */
    public function hired(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'hired',
        ]);
    }
}
