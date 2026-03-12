<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Profile;
use App\Models\ProfileLanguage;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ProfileLanguage>
 */
class ProfileLanguageFactory extends Factory
{
    protected $model = ProfileLanguage::class;

    /**
     * Common languages in Morocco.
     */
    private const LANGUAGES = [
        'French' => 'fluent',
        'Arabic' => 'native',
        'English' => 'intermediate',
        'Spanish' => 'basic',
        'German' => 'basic',
        'Italian' => 'basic',
    ];

    /**
     * Proficiency levels.
     */
    private const PROFICIENCY_LEVELS = ['basic', 'intermediate', 'fluent', 'native'];

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $language = fake()->randomElement(array_keys(self::LANGUAGES));

        return [
            'profile_id' => Profile::factory(),
            'language' => $language,
            'proficiency' => fake()->randomElement(self::PROFICIENCY_LEVELS),
        ];
    }

    /**
     * Create French language entry.
     */
    public function french(): static
    {
        return $this->state(fn (array $attributes) => [
            'language' => 'French',
            'proficiency' => fake()->randomElement(['fluent', 'native']),
        ]);
    }

    /**
     * Create Arabic language entry.
     */
    public function arabic(): static
    {
        return $this->state(fn (array $attributes) => [
            'language' => 'Arabic',
            'proficiency' => 'native',
        ]);
    }

    /**
     * Create English language entry.
     */
    public function english(): static
    {
        return $this->state(fn (array $attributes) => [
            'language' => 'English',
            'proficiency' => fake()->randomElement(['intermediate', 'fluent']),
        ]);
    }
}
