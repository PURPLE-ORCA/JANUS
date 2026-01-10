<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Offer extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'company_id',
        'slug',
        'title',
        'description',
        'location',
        'work_mode',
        'salary_range',
        'type',
        'experience_level',
        'education_required',
        'languages_required',
        'benefits',
        'positions_count',
        'views_count',
        'is_urgent',
        'is_active',
        'deadline',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'languages_required' => 'array',
            'benefits' => 'array',
            'positions_count' => 'integer',
            'views_count' => 'integer',
            'is_urgent' => 'boolean',
            'is_active' => 'boolean',
            'deadline' => 'date',
        ];
    }

    // ─────────────────────────────────────────────────────────────
    // Relationships
    // ─────────────────────────────────────────────────────────────

    /**
     * Get the company that owns the offer.
     */
    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    /**
     * Get the offer's screener questions.
     */
    public function screenerQuestions(): HasMany
    {
        return $this->hasMany(OfferScreenerQuestion::class)->orderBy('order');
    }

    /**
     * Get the offer's applications.
     */
    public function applications(): HasMany
    {
        return $this->hasMany(Application::class);
    }

    // ─────────────────────────────────────────────────────────────
    // Scopes
    // ─────────────────────────────────────────────────────────────

    /**
     * Scope a query to only include active offers.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope a query to only include urgent offers.
     */
    public function scopeUrgent($query)
    {
        return $query->where('is_urgent', true);
    }
}
