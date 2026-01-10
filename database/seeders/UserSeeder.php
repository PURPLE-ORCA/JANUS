<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Seed users with different roles and statuses.
     */
    public function run(): void
    {
        // Create admin users
        User::factory()->create([
            'name' => 'Admin Principal',
            'email' => 'admin@janus.ma',
            'role' => 'admin',
            'status' => 'active',
        ]);

        User::factory()->create([
            'name' => 'Admin Recruteur',
            'email' => 'recruteur@janus.ma',
            'role' => 'admin',
            'status' => 'active',
        ]);

        // Create test candidate user
        User::factory()->create([
            'name' => 'Candidat Test',
            'email' => 'candidat@janus.ma',
            'role' => 'candidate',
            'status' => 'active',
        ]);

        // Create pending candidates (for testing approval flow)
        User::factory()->pending()->count(5)->create();

        // Create active candidates
        User::factory()->count(20)->create();

        // Create rejected candidates
        User::factory()->rejected()->count(3)->create();
    }
}
