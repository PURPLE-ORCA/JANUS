<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Profile;
use App\Models\ProfileEducation;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ProfileEducation>
 */
class ProfileEducationFactory extends Factory
{
    protected $model = ProfileEducation::class;

    /**
     * Moroccan universities and schools.
     */
    private const INSTITUTIONS = [
        'Université Mohammed V',
        'Université Hassan II',
        'Université Cadi Ayyad',
        'École Mohammadia d\'Ingénieurs',
        'ENSA Marrakech',
        'ENCG Casablanca',
        'ENSIAS Rabat',
        'INPT Rabat',
        'Al Akhawayn University',
        'UM6P',
        'ISCAE',
        'HEM Business School',
        'École Centrale Casablanca',
        'ESITH',
    ];

    /**
     * Degree types.
     */
    private const DEGREES = [
        'Licence',
        'Master',
        'Diplôme d\'Ingénieur',
        'Doctorat',
        'DUT',
        'BTS',
        'DEUG',
        'MBA',
    ];

    /**
     * Fields of study.
     */
    private const FIELDS = [
        'Informatique',
        'Génie Logiciel',
        'Réseaux et Systèmes',
        'Data Science',
        'Management',
        'Finance',
        'Marketing',
        'Commerce International',
        'Génie Électrique',
        'Génie Civil',
    ];

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $startYear = fake()->numberBetween(2010, 2022);
        $duration = fake()->numberBetween(2, 5);

        return [
            'profile_id' => Profile::factory(),
            'institution' => fake()->randomElement(self::INSTITUTIONS),
            'degree' => fake()->randomElement(self::DEGREES),
            'field' => fake()->randomElement(self::FIELDS),
            'start_date' => "{$startYear}-09-01",
            'end_date' => fake()->optional(0.9)->passthrough("{$startYear + $duration}-06-30"),
        ];
    }

    /**
     * Create a current education (no end date).
     */
    public function current(): static
    {
        return $this->state(fn (array $attributes) => [
            'end_date' => null,
        ]);
    }
}
