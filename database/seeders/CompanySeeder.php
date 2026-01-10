<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Company;
use Illuminate\Database\Seeder;

class CompanySeeder extends Seeder
{
    /**
     * Seed Moroccan companies across different sectors.
     */
    public function run(): void
    {
        // Create specific well-known Moroccan companies
        $companies = [
            [
                'name' => 'TechnoHub Maroc',
                'sector' => 'tech',
                'city' => 'Casablanca',
                'description' => 'Leader du développement logiciel au Maroc, spécialisé dans les solutions cloud et l\'intelligence artificielle.',
                'website_url' => 'https://technohub.ma',
                'is_verified' => true,
            ],
            [
                'name' => 'FinanceFirst',
                'sector' => 'finance',
                'city' => 'Casablanca',
                'description' => 'Cabinet de conseil en finance et gestion de patrimoine.',
                'website_url' => 'https://financefirst.ma',
                'is_verified' => true,
            ],
            [
                'name' => 'MedCare Solutions',
                'sector' => 'healthcare',
                'city' => 'Rabat',
                'description' => 'Solutions digitales pour le secteur de la santé.',
                'website_url' => 'https://medcare.ma',
                'is_verified' => true,
            ],
            [
                'name' => 'Atlas Digital',
                'sector' => 'tech',
                'city' => 'Marrakech',
                'description' => 'Agence digitale spécialisée dans le e-commerce et le marketing digital.',
                'website_url' => 'https://atlasdigital.ma',
                'is_verified' => true,
            ],
            [
                'name' => 'EduTech Morocco',
                'sector' => 'education',
                'city' => 'Rabat',
                'description' => 'Plateforme d\'apprentissage en ligne pour les professionnels.',
                'website_url' => 'https://edutech.ma',
                'is_verified' => true,
            ],
            [
                'name' => 'RetailMax',
                'sector' => 'retail',
                'city' => 'Casablanca',
                'description' => 'Grande distribution et commerce de détail.',
                'website_url' => null,
                'is_verified' => true,
            ],
            [
                'name' => 'ConsultPro Maroc',
                'sector' => 'services',
                'city' => 'Tanger',
                'description' => 'Cabinet de conseil en stratégie et transformation digitale.',
                'website_url' => 'https://consultpro.ma',
                'is_verified' => false,
            ],
            [
                'name' => 'StartupLab',
                'sector' => 'tech',
                'city' => 'Casablanca',
                'description' => 'Incubateur et accélérateur de startups tech.',
                'website_url' => 'https://startuplab.ma',
                'is_verified' => true,
            ],
            [
                'name' => 'GreenEnergy Maroc',
                'sector' => 'other',
                'city' => 'Agadir',
                'description' => 'Entreprise spécialisée dans les énergies renouvelables.',
                'website_url' => 'https://greenenergy.ma',
                'is_verified' => false,
            ],
            [
                'name' => 'DataWise',
                'sector' => 'tech',
                'city' => 'Fès',
                'description' => 'Expertise en data science et analytics.',
                'website_url' => 'https://datawise.ma',
                'is_verified' => true,
            ],
        ];

        foreach ($companies as $company) {
            Company::create($company);
        }

        // Create additional random companies
        Company::factory()->count(5)->create();
    }
}
