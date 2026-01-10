<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Profile;

class ProfileStrengthService
{
    /**
     * Calculate profile completion percentage.
     *
     * Weights:
     * - Basic info (20%): headline, phone, city
     * - Resume (30%): resume_path uploaded
     * - Education (15%): at least one education entry
     * - Experience (20%): at least one experience entry  
     * - Languages (15%): at least two languages
     */
    public function calculate(?Profile $profile): array
    {
        if (!$profile) {
            return [
                'percentage' => 0,
                'sections' => [],
            ];
        }

        $sections = [];
        $totalPercentage = 0;

        // Basic info (20%)
        $basicInfoScore = 0;
        if ($profile->headline) $basicInfoScore += 33;
        if ($profile->phone) $basicInfoScore += 33;
        if ($profile->city) $basicInfoScore += 34;
        
        $sections['basic_info'] = [
            'label' => 'Informations de base',
            'complete' => $basicInfoScore === 100,
            'percentage' => $basicInfoScore,
            'weight' => 20,
        ];
        $totalPercentage += ($basicInfoScore / 100) * 20;

        // Resume (30%)
        $hasResume = !empty($profile->resume_path);
        $sections['resume'] = [
            'label' => 'CV',
            'complete' => $hasResume,
            'percentage' => $hasResume ? 100 : 0,
            'weight' => 30,
        ];
        $totalPercentage += $hasResume ? 30 : 0;

        // Education (15%)
        $hasEducation = $profile->education()->exists();
        $sections['education'] = [
            'label' => 'Formation',
            'complete' => $hasEducation,
            'percentage' => $hasEducation ? 100 : 0,
            'weight' => 15,
        ];
        $totalPercentage += $hasEducation ? 15 : 0;

        // Experience (20%)
        $hasExperience = $profile->experience()->exists();
        $sections['experience'] = [
            'label' => 'Expérience',
            'complete' => $hasExperience,
            'percentage' => $hasExperience ? 100 : 0,
            'weight' => 20,
        ];
        $totalPercentage += $hasExperience ? 20 : 0;

        // Languages (15%)
        $languageCount = $profile->languages()->count();
        $hasEnoughLanguages = $languageCount >= 2;
        $sections['languages'] = [
            'label' => 'Langues',
            'complete' => $hasEnoughLanguages,
            'percentage' => min(100, ($languageCount / 2) * 100),
            'weight' => 15,
        ];
        $totalPercentage += $hasEnoughLanguages ? 15 : (($languageCount / 2) * 15);

        return [
            'percentage' => round($totalPercentage),
            'sections' => $sections,
        ];
    }
}
