<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Profile;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Profile>
 */
class ProfileFactory extends Factory
{
    protected $model = Profile::class;

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
     * Skills pool for candidates.
     */
    private const SKILLS = [
        'PHP', 'Laravel', 'React', 'Vue.js', 'JavaScript', 'TypeScript',
        'Python', 'Django', 'Node.js', 'PostgreSQL', 'MySQL', 'MongoDB',
        'Docker', 'Kubernetes', 'AWS', 'Git', 'REST API', 'GraphQL',
        'HTML', 'CSS', 'Tailwind CSS', 'Figma', 'Adobe XD', 'Photoshop',
        'Project Management', 'Agile', 'Scrum', 'Communication', 'Leadership',
        'Marketing', 'SEO', 'Google Analytics', 'Excel', 'Power BI',
    ];

    /**
     * Education levels (Morocco Bac+X system).
     */
    private const EDUCATION_LEVELS = ['bac', 'bac+2', 'bac+3', 'bac+5', 'phd'];

    /**
     * Availability options.
     */
    private const AVAILABILITY = ['immediate', '1_week', '1_month', 'negotiable'];

    /**
     * Job headlines.
     */
    private const HEADLINES = [
        'Développeur Full Stack',
        'Ingénieur Logiciel',
        'Chef de Projet IT',
        'Analyste Business',
        'Data Scientist',
        'UX/UI Designer',
        'DevOps Engineer',
        'Product Manager',
        'Marketing Digital',
        'Consultant IT',
        'Développeur Mobile',
        'Architecte Logiciel',
        'Scrum Master',
        'QA Engineer',
        'Frontend Developer',
        'Backend Developer',
    ];

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $birthYear = fake()->numberBetween(1975, 2002);

        return [
            'user_id' => User::factory(),
            'headline' => fake()->randomElement(self::HEADLINES),
            'resume_path' => fake()->optional(0.6)->randomElement([
                'resumes/resume_'.fake()->uuid().'.pdf',
            ]),
            'phone' => '+212 ' . fake()->numerify('6## ### ###'),
            'skills' => fake()->randomElements(self::SKILLS, fake()->numberBetween(3, 8)),
            'linkedin_url' => fake()->optional(0.5)->url(),
            'portfolio_url' => fake()->optional(0.3)->url(),
            'city' => fake()->randomElement(self::MOROCCAN_CITIES),
            'country' => 'Morocco',
            'date_of_birth' => fake()->dateTimeBetween("{$birthYear}-01-01", "{$birthYear}-12-31"),
            'nationality' => fake()->randomElement(['Moroccan', 'Moroccan', 'French', 'Tunisian']),
            'years_of_experience' => fake()->numberBetween(0, 15),
            'expected_salary' => fake()->randomElement([
                '8k-12k MAD',
                '12k-18k MAD',
                '18k-25k MAD',
                '25k-35k MAD',
                '35k-50k MAD',
                '50k+ MAD',
            ]),
            'availability' => fake()->randomElement(self::AVAILABILITY),
            'education_level' => fake()->randomElement(self::EDUCATION_LEVELS),
            'has_driving_license' => fake()->boolean(60),
        ];
    }

    /**
     * Create a profile with a resume.
     */
    public function withResume(): static
    {
        return $this->state(fn (array $attributes) => [
            'resume_path' => 'resumes/resume_'.fake()->uuid().'.pdf',
        ]);
    }

    /**
     * Create a profile without a resume.
     */
    public function withoutResume(): static
    {
        return $this->state(fn (array $attributes) => [
            'resume_path' => null,
        ]);
    }

    /**
     * Create a senior-level profile.
     */
    public function senior(): static
    {
        return $this->state(fn (array $attributes) => [
            'years_of_experience' => fake()->numberBetween(8, 20),
            'education_level' => fake()->randomElement(['bac+5', 'phd']),
            'expected_salary' => fake()->randomElement(['35k-50k MAD', '50k+ MAD']),
        ]);
    }

    /**
     * Create a junior-level profile.
     */
    public function junior(): static
    {
        return $this->state(fn (array $attributes) => [
            'years_of_experience' => fake()->numberBetween(0, 2),
            'education_level' => fake()->randomElement(['bac', 'bac+2', 'bac+3']),
            'expected_salary' => fake()->randomElement(['8k-12k MAD', '12k-18k MAD']),
            'availability' => 'immediate',
        ]);
    }
}
