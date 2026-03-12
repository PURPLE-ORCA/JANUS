<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Company;
use App\Models\Offer;
use App\Models\OfferScreenerQuestion;
use Illuminate\Database\Seeder;

class OfferSeeder extends Seeder
{
    /**
     * Seed job offers with screener questions.
     */
    public function run(): void
    {
        $companies = Company::all();

        foreach ($companies as $company) {
            // Create 1-4 offers per company
            $offerCount = fake()->numberBetween(1, 4);

            $offers = Offer::factory()
                ->count($offerCount)
                ->create(['company_id' => $company->id]);

            // Add screener questions to some offers
            foreach ($offers as $offer) {
                if (fake()->boolean(60)) { // 60% of offers have screener questions
                    $questionCount = fake()->numberBetween(1, 4);

                    for ($i = 1; $i <= $questionCount; $i++) {
                        OfferScreenerQuestion::factory()->create([
                            'offer_id' => $offer->id,
                            'order' => $i,
                        ]);
                    }
                }
            }
        }

        // Create some urgent offers
        Offer::factory()->urgent()->count(3)->create([
            'company_id' => $companies->random()->id,
        ]);

        // Create some internship offers
        Offer::factory()->internship()->count(2)->create([
            'company_id' => $companies->random()->id,
        ]);

        // Create some remote offers
        Offer::factory()->remote()->count(3)->create([
            'company_id' => $companies->random()->id,
        ]);
    }
}
