<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Profile;
use App\Models\ProfileEducation;
use App\Models\ProfileExperience;
use App\Models\ProfileLanguage;
use App\Models\User;
use Illuminate\Database\Seeder;

class ProfileSeeder extends Seeder
{
    /**
     * Create profiles with education, experience, and languages.
     */
    public function run(): void
    {
        // Get all candidate users
        $candidates = User::where('role', 'candidate')->get();

        foreach ($candidates as $user) {
            // Create profile
            $profile = Profile::factory()->create([
                'user_id' => $user->id,
            ]);

            // Add education (1-3 entries)
            $educationCount = fake()->numberBetween(1, 3);
            ProfileEducation::factory()
                ->count($educationCount)
                ->create(['profile_id' => $profile->id]);

            // Add experience (0-4 entries)
            $experienceCount = fake()->numberBetween(0, 4);
            if ($experienceCount > 0) {
                ProfileExperience::factory()
                    ->count($experienceCount)
                    ->create(['profile_id' => $profile->id]);
            }

            // Add languages (2-4 entries)
            // Always add French and Arabic for Moroccan candidates
            ProfileLanguage::factory()
                ->french()
                ->create(['profile_id' => $profile->id]);

            ProfileLanguage::factory()
                ->arabic()
                ->create(['profile_id' => $profile->id]);

            // Optionally add English
            if (fake()->boolean(70)) {
                ProfileLanguage::factory()
                    ->english()
                    ->create(['profile_id' => $profile->id]);
            }

            // Optionally add another language
            if (fake()->boolean(20)) {
                ProfileLanguage::factory()
                    ->create([
                        'profile_id' => $profile->id,
                        'language' => fake()->randomElement(['Spanish', 'German', 'Italian']),
                        'proficiency' => 'basic',
                    ]);
            }
        }
    }
}
