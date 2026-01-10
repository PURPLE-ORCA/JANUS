<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Profile;
use App\Models\ProfileExperience;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ProfileExperience>
 */
class ProfileExperienceFactory extends Factory
{
    protected $model = ProfileExperience::class;

    /**
     * Moroccan companies for realistic work history.
     */
    private const COMPANIES = [
        'OCP Group',
        'Maroc Telecom',
        'BMCE Bank',
        'Attijariwafa Bank',
        'Royal Air Maroc',
        'Inwi',
        'Orange Maroc',
        'Capgemini Maroc',
        'CGI Maroc',
        'Atos Maroc',
        'Sopra Banking',
        'Société Générale Maroc',
        'Majorel',
        'Webhelp Maroc',
        'Alten Maroc',
    ];

    /**
     * Job titles.
     */
    private const TITLES = [
        'Développeur Junior',
        'Développeur Full Stack',
        'Ingénieur Logiciel',
        'Chef de Projet',
        'Analyste Fonctionnel',
        'DevOps Engineer',
        'Data Analyst',
        'QA Engineer',
        'Consultant IT',
        'Product Owner',
        'Scrum Master',
        'Architecte Technique',
    ];

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $startYear = fake()->numberBetween(2015, 2024);
        $isCurrent = fake()->boolean(30);

        return [
            'profile_id' => Profile::factory(),
            'company' => fake()->randomElement(self::COMPANIES),
            'title' => fake()->randomElement(self::TITLES),
            'description' => fake()->optional(0.8)->paragraphs(2, true),
            'start_date' => "{$startYear}-" . fake()->numberBetween(1, 12) . "-01",
            'end_date' => $isCurrent ? null : fake()->dateTimeBetween("{$startYear}-01-01", 'now'),
            'is_current' => $isCurrent,
        ];
    }

    /**
     * Create a current position.
     */
    public function current(): static
    {
        return $this->state(fn (array $attributes) => [
            'end_date' => null,
            'is_current' => true,
        ]);
    }

    /**
     * Create a past position.
     */
    public function past(): static
    {
        return $this->state(fn (array $attributes) => [
            'end_date' => fake()->dateTimeBetween('-2 years', 'now'),
            'is_current' => false,
        ]);
    }
}
