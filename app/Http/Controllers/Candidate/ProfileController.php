<?php

declare(strict_types=1);

namespace App\Http\Controllers\Candidate;

use App\Http\Controllers\Controller;
use App\Services\ProfileStrengthService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rules\File;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function __construct(
        private readonly ProfileStrengthService $profileStrengthService,
    ) {}

    /**
     * Display the profile edit form.
     */
    public function edit(Request $request): Response
    {
        $user = $request->user();
        $profile = $user->profile()->with(['education', 'experience', 'languages'])->first();

        return Inertia::render('profile/edit', [
            'profile' => $profile,
            'strength' => $this->profileStrengthService->calculate($profile),
        ]);
    }

    /**
     * Update the user's profile.
     */
    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'headline' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:20'],
            'city' => ['nullable', 'string', 'max:100'],
            'country' => ['nullable', 'string', 'max:100'],
            'date_of_birth' => ['nullable', 'date'],
            'nationality' => ['nullable', 'string', 'max:100'],
            'years_of_experience' => ['nullable', 'integer', 'min:0', 'max:50'],
            'expected_salary' => ['nullable', 'string', 'max:50'],
            'availability' => ['nullable', 'string', 'in:immediate,1_week,1_month,negotiable'],
            'education_level' => ['nullable', 'string', 'in:bac,bac+2,bac+3,bac+5,phd'],
            'has_driving_license' => ['nullable', 'boolean'],
            'skills' => ['nullable', 'array'],
            'skills.*' => ['string', 'max:100'],
            'linkedin_url' => ['nullable', 'url', 'max:255'],
            'portfolio_url' => ['nullable', 'url', 'max:255'],
        ]);

        $user = $request->user();

        // Create or update profile
        $profile = $user->profile()->updateOrCreate(
            ['user_id' => $user->id],
            $validated
        );

        return back()->with('success', 'Profil mis à jour avec succès.');
    }

    /**
     * Upload a resume file.
     */
    public function uploadResume(Request $request): RedirectResponse
    {
        $request->validate([
            'resume' => [
                'required',
                File::types(['pdf'])
                    ->max(5 * 1024), // 5MB max
            ],
        ]);

        $user = $request->user();
        $profile = $user->profile;

        if (!$profile) {
            $profile = $user->profile()->create([]);
        }

        // Delete old resume if exists
        if ($profile->resume_path) {
            Storage::disk('public')->delete($profile->resume_path);
        }

        // Store new resume
        $path = $request->file('resume')->store('resumes', 'public');

        $profile->update(['resume_path' => $path]);

        return back()->with('success', 'CV téléchargé avec succès.');
    }

    /**
     * Delete the resume file.
     */
    public function deleteResume(Request $request): RedirectResponse
    {
        $user = $request->user();
        $profile = $user->profile;

        if ($profile?->resume_path) {
            Storage::disk('public')->delete($profile->resume_path);
            $profile->update(['resume_path' => null]);
        }

        return back()->with('success', 'CV supprimé.');
    }
}
