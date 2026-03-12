<?php

declare(strict_types=1);

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class FileUploadService
{
    /**
     * Upload a resume file.
     */
    public function uploadResume(UploadedFile $file, ?string $existingPath = null): string
    {
        // Delete old file if exists
        if ($existingPath) {
            $this->delete($existingPath);
        }

        return $file->store('resumes', 'public');
    }

    /**
     * Upload a company logo.
     */
    public function uploadLogo(UploadedFile $file, ?string $existingPath = null): string
    {
        // Delete old file if exists
        if ($existingPath) {
            $this->delete($existingPath);
        }

        return $file->store('logos', 'public');
    }

    /**
     * Upload a user avatar.
     */
    public function uploadAvatar(UploadedFile $file, ?string $existingPath = null): string
    {
        // Delete old file if exists
        if ($existingPath) {
            $this->delete($existingPath);
        }

        return $file->store('avatars', 'public');
    }

    /**
     * Delete a file from storage.
     */
    public function delete(?string $path): bool
    {
        if (!$path) {
            return true;
        }

        return Storage::disk('public')->delete($path);
    }

    /**
     * Get the public URL for a file.
     */
    public function getUrl(?string $path): ?string
    {
        if (!$path) {
            return null;
        }

        return Storage::disk('public')->url($path);
    }

    /**
     * Check if a file exists.
     */
    public function exists(?string $path): bool
    {
        if (!$path) {
            return false;
        }

        return Storage::disk('public')->exists($path);
    }
}
