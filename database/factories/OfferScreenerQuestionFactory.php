<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Offer;
use App\Models\OfferScreenerQuestion;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\OfferScreenerQuestion>
 */
class OfferScreenerQuestionFactory extends Factory
{
    protected $model = OfferScreenerQuestion::class;

    /**
     * Common screener questions.
     */
    private const QUESTIONS = [
        ['question' => 'Êtes-vous titulaire d\'un permis de conduire?', 'type' => 'yes_no'],
        ['question' => 'Êtes-vous disponible immédiatement?', 'type' => 'yes_no'],
        ['question' => 'Acceptez-vous de travailler le week-end?', 'type' => 'yes_no'],
        ['question' => 'Acceptez-vous les déplacements fréquents?', 'type' => 'yes_no'],
        ['question' => 'Combien d\'années d\'expérience avez-vous?', 'type' => 'number'],
        ['question' => 'Quel est votre niveau en anglais?', 'type' => 'text'],
        ['question' => 'Pourquoi souhaitez-vous rejoindre notre équipe?', 'type' => 'text'],
        ['question' => 'Quelle est votre prétention salariale?', 'type' => 'text'],
    ];

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $questionData = fake()->randomElement(self::QUESTIONS);

        return [
            'offer_id' => Offer::factory(),
            'question' => $questionData['question'],
            'type' => $questionData['type'],
            'is_required' => fake()->boolean(70),
            'order' => fake()->numberBetween(1, 10),
        ];
    }

    /**
     * Create a required question.
     */
    public function required(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_required' => true,
        ]);
    }

    /**
     * Create a yes/no question.
     */
    public function yesNo(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'yes_no',
            'question' => fake()->randomElement([
                'Êtes-vous titulaire d\'un permis de conduire?',
                'Êtes-vous disponible immédiatement?',
                'Acceptez-vous de travailler le week-end?',
            ]),
        ]);
    }
}
