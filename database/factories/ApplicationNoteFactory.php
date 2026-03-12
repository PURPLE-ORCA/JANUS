<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Application;
use App\Models\ApplicationNote;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ApplicationNote>
 */
class ApplicationNoteFactory extends Factory
{
    protected $model = ApplicationNote::class;

    /**
     * Sample recruiter notes.
     */
    private const NOTES = [
        'Bon profil, à recontacter.',
        'Expérience solide en développement.',
        'Compétences techniques confirmées lors de l\'entretien.',
        'Candidat motivé et disponible immédiatement.',
        'À considérer pour d\'autres postes.',
        'Références vérifiées, positives.',
        'Entretien téléphonique effectué.',
        'Portfolio impressionnant.',
        'Prétentions salariales au-dessus du budget.',
        'Besoin de formation complémentaire.',
    ];

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'application_id' => Application::factory(),
            'user_id' => User::factory()->admin(),
            'note' => fake()->randomElement(self::NOTES),
        ];
    }
}
