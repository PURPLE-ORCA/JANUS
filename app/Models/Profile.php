<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Profile extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'headline',
        'resume_path',
        'phone',
        'skills',
        'linkedin_url',
        'portfolio_url',
        'city',
        'country',
        'date_of_birth',
        'nationality',
        'years_of_experience',
        'expected_salary',
        'availability',
        'education_level',
        'has_driving_license',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'skills' => 'array',
            'date_of_birth' => 'date',
            'years_of_experience' => 'integer',
            'has_driving_license' => 'boolean',
        ];
    }

    // ─────────────────────────────────────────────────────────────
    // Relationships
    // ─────────────────────────────────────────────────────────────

    /**
     * Get the user that owns the profile.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the profile's education history.
     */
    public function education(): HasMany
    {
        return $this->hasMany(ProfileEducation::class);
    }

    /**
     * Get the profile's work experience.
     */
    public function experience(): HasMany
    {
        return $this->hasMany(ProfileExperience::class);
    }

    /**
     * Get the profile's languages.
     */
    public function languages(): HasMany
    {
        return $this->hasMany(ProfileLanguage::class);
    }
}
