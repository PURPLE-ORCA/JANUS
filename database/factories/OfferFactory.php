<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Company;
use App\Models\Offer;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Offer>
 */
class OfferFactory extends Factory
{
    protected $model = Offer::class;

    /**
     * Moroccan cities for job locations.
     */
    private const LOCATIONS = [
        'Casablanca',
        'Rabat',
        'Marrakech',
        'Fès',
        'Tanger',
        'Agadir',
        'Remote',
        'Casablanca / Remote',
        'Rabat / Hybrid',
    ];

    /**
     * Offer types.
     */
    private const TYPES = ['full-time', 'part-time', 'freelance', 'internship'];

    /**
     * Work modes.
     */
    private const WORK_MODES = ['onsite', 'remote', 'hybrid'];

    /**
     * Experience levels.
     */
    private const EXPERIENCE_LEVELS = ['junior', 'mid', 'senior', 'lead'];

    /**
     * Education requirements.
     */
    private const EDUCATION_REQUIRED = ['none', 'bac', 'bac+2', 'bac+3', 'bac+5'];

    /**
     * Common benefits.
     */
    private const BENEFITS = [
        'health_insurance',
        'remote_days',
        'flexible_hours',
        'meal_vouchers',
        'gym_membership',
        'training_budget',
        'annual_bonus',
        'company_car',
        'phone_allowance',
        'relocation_support',
    ];

    /**
     * Job titles.
     */
    private const JOB_TITLES = [
        'Développeur Full Stack',
        'Développeur Frontend React',
        'Développeur Backend Laravel',
        'DevOps Engineer',
        'Data Analyst',
        'Product Manager',
        'UX/UI Designer',
        'Chef de Projet IT',
        'Consultant IT',
        'Ingénieur QA',
        'Développeur Mobile',
        'Architecte Solutions',
        'Scrum Master',
        'Business Analyst',
        'Marketing Digital Manager',
    ];

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = fake()->randomElement(self::JOB_TITLES);

        return [
            'company_id' => Company::factory(),
            'slug' => Str::slug($title) . '-' . fake()->unique()->numerify('###'),
            'title' => $title,
            'description' => $this->generateDescription(),
            'location' => fake()->randomElement(self::LOCATIONS),
            'work_mode' => fake()->randomElement(self::WORK_MODES),
            'salary_range' => fake()->optional(0.7)->randomElement([
                '8k - 12k MAD',
                '12k - 18k MAD',
                '18k - 25k MAD',
                '25k - 35k MAD',
                '35k - 50k MAD',
                'Selon profil',
            ]),
            'type' => fake()->randomElement(self::TYPES),
            'experience_level' => fake()->randomElement(self::EXPERIENCE_LEVELS),
            'education_required' => fake()->randomElement(self::EDUCATION_REQUIRED),
            'languages_required' => fake()->randomElements(['french', 'english', 'arabic'], fake()->numberBetween(1, 3)),
            'benefits' => fake()->optional(0.8)->randomElements(self::BENEFITS, fake()->numberBetween(2, 5)),
            'positions_count' => fake()->numberBetween(1, 5),
            'views_count' => fake()->numberBetween(0, 500),
            'is_urgent' => fake()->boolean(20), // 20% urgent
            'is_active' => fake()->boolean(85), // 85% active
            'deadline' => fake()->dateTimeBetween('now', '+3 months'),
        ];
    }

    /**
     * Generate a realistic job description.
     */
    private function generateDescription(): string
    {
        $paragraphs = [
            '<h2>À propos du poste</h2>',
            '<p>' . fake()->paragraphs(2, true) . '</p>',
            '<h2>Responsabilités</h2>',
            '<ul>',
            '<li>' . fake()->sentence() . '</li>',
            '<li>' . fake()->sentence() . '</li>',
            '<li>' . fake()->sentence() . '</li>',
            '<li>' . fake()->sentence() . '</li>',
            '</ul>',
            '<h2>Profil recherché</h2>',
            '<ul>',
            '<li>' . fake()->sentence() . '</li>',
            '<li>' . fake()->sentence() . '</li>',
            '<li>' . fake()->sentence() . '</li>',
            '</ul>',
        ];

        return implode("\n", $paragraphs);
    }

    /**
     * Create an active offer.
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => true,
        ]);
    }

    /**
     * Create an inactive offer.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }

    /**
     * Create an urgent offer.
     */
    public function urgent(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_urgent' => true,
        ]);
    }

    /**
     * Create a remote offer.
     */
    public function remote(): static
    {
        return $this->state(fn (array $attributes) => [
            'work_mode' => 'remote',
            'location' => 'Remote',
        ]);
    }

    /**
     * Create a senior-level offer.
     */
    public function senior(): static
    {
        return $this->state(fn (array $attributes) => [
            'experience_level' => 'senior',
            'education_required' => 'bac+5',
            'salary_range' => fake()->randomElement(['35k - 50k MAD', '50k+ MAD']),
        ]);
    }

    /**
     * Create an internship offer.
     */
    public function internship(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'internship',
            'experience_level' => 'junior',
            'education_required' => 'bac+3',
            'salary_range' => '3k - 6k MAD',
        ]);
    }
}
