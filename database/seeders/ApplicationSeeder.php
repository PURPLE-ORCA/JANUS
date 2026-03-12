<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Application;
use App\Models\ApplicationNote;
use App\Models\Offer;
use App\Models\User;
use Illuminate\Database\Seeder;

class ApplicationSeeder extends Seeder
{
    /**
     * Seed applications with varied statuses.
     */
    public function run(): void
    {
        $candidates = User::where('role', 'candidate')
            ->where('status', 'active')
            ->get();

        $offers = Offer::where('is_active', true)->get();
        $admins = User::where('role', 'admin')->get();

        foreach ($candidates as $candidate) {
            // Each candidate applies to 0-5 random offers
            $applicationCount = fake()->numberBetween(0, 5);

            if ($applicationCount === 0) {
                continue;
            }

            $randomOffers = $offers->random(min($applicationCount, $offers->count()));

            foreach ($randomOffers as $offer) {
                // Check if application already exists
                $exists = Application::where('user_id', $candidate->id)
                    ->where('offer_id', $offer->id)
                    ->exists();

                if ($exists) {
                    continue;
                }

                $application = Application::factory()->create([
                    'user_id' => $candidate->id,
                    'offer_id' => $offer->id,
                ]);

                // Add recruiter notes to some applications
                if (fake()->boolean(40)) {
                    $noteCount = fake()->numberBetween(1, 3);

                    for ($i = 0; $i < $noteCount; $i++) {
                        ApplicationNote::factory()->create([
                            'application_id' => $application->id,
                            'user_id' => $admins->random()->id,
                        ]);
                    }
                }
            }
        }
    }
}
