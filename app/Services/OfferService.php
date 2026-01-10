<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Offer;
use Illuminate\Support\Str;

class OfferService
{
    /**
     * Create a new offer with auto-generated slug.
     */
    public function create(array $data): Offer
    {
        $data['slug'] = $this->generateUniqueSlug($data['title']);
        $data['views_count'] = 0;

        return Offer::create($data);
    }

    /**
     * Update an offer, regenerating slug if title changed.
     */
    public function update(Offer $offer, array $data): Offer
    {
        // Regenerate slug only if title changed
        if (isset($data['title']) && $offer->title !== $data['title']) {
            $data['slug'] = $this->generateUniqueSlug($data['title'], $offer->id);
        }

        $offer->update($data);

        return $offer;
    }

    /**
     * Toggle offer active status.
     */
    public function toggleActive(Offer $offer): Offer
    {
        $offer->update(['is_active' => !$offer->is_active]);

        return $offer;
    }

    /**
     * Check if offer can be deleted.
     */
    public function canDelete(Offer $offer): bool
    {
        return !$offer->applications()->exists();
    }

    /**
     * Delete an offer (only if no applications).
     */
    public function delete(Offer $offer): bool
    {
        if (!$this->canDelete($offer)) {
            return false;
        }

        $offer->delete();

        return true;
    }

    /**
     * Increment views count.
     */
    public function incrementViews(Offer $offer): void
    {
        $offer->increment('views_count');
    }

    /**
     * Check if offer deadline has passed.
     */
    public function isExpired(Offer $offer): bool
    {
        if (!$offer->deadline) {
            return false;
        }

        return $offer->deadline->isPast();
    }

    /**
     * Get offers expiring soon (within days).
     */
    public function getExpiringSoon(int $days = 7): \Illuminate\Database\Eloquent\Collection
    {
        return Offer::query()
            ->where('is_active', true)
            ->whereNotNull('deadline')
            ->whereBetween('deadline', [now(), now()->addDays($days)])
            ->get();
    }

    /**
     * Generate a unique slug.
     */
    public function generateUniqueSlug(string $title, ?int $excludeId = null): string
    {
        $slug = Str::slug($title);
        $originalSlug = $slug;
        $count = 1;

        while (
            Offer::where('slug', $slug)
                ->when($excludeId, fn ($q) => $q->where('id', '!=', $excludeId))
                ->exists()
        ) {
            $slug = "{$originalSlug}-{$count}";
            $count++;
        }

        return $slug;
    }
}
