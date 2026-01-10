<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Company;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Company>
 */
class CompanyFactory extends Factory
{
    protected $model = Company::class;

    /**
     * Moroccan cities for realistic data.
     */
    private const MOROCCAN_CITIES = [
        'Casablanca',
        'Rabat',
        'Marrakech',
        'Fès',
        'Tanger',
        'Agadir',
        'Oujda',
        'Kénitra',
        'Tétouan',
        'Salé',
    ];

    /**
     * Company sectors.
     */
    private const SECTORS = [
        'tech',
        'finance',
        'healthcare',
        'retail',
        'services',
        'education',
        'other',
    ];

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->company(),
            'logo_path' => null,
            'website_url' => fake()->optional(0.7)->url(),
            'sector' => fake()->randomElement(self::SECTORS),
            'description' => fake()->optional(0.8)->paragraphs(2, true),
            'city' => fake()->randomElement(self::MOROCCAN_CITIES),
            'is_verified' => fake()->boolean(70), // 70% verified
        ];
    }

    /**
     * Create a verified company.
     */
    public function verified(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_verified' => true,
        ]);
    }

    /**
     * Create an unverified company.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_verified' => false,
        ]);
    }

    /**
     * Create a tech company.
     */
    public function tech(): static
    {
        return $this->state(fn (array $attributes) => [
            'sector' => 'tech',
        ]);
    }

    /**
     * Create a finance company.
     */
    public function finance(): static
    {
        return $this->state(fn (array $attributes) => [
            'sector' => 'finance',
        ]);
    }
}
