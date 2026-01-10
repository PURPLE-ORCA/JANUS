<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('offers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->string('slug')->unique();
            $table->string('title');
            $table->text('description'); // Rich text (HTML)
            $table->string('location'); // City or 'Remote'
            
            // Work details
            $table->enum('work_mode', ['onsite', 'remote', 'hybrid']);
            $table->string('salary_range')->nullable(); // e.g., '15k-25k MAD'
            $table->enum('type', ['full-time', 'part-time', 'freelance', 'internship']);
            
            // Requirements
            $table->enum('experience_level', ['junior', 'mid', 'senior', 'lead']);
            $table->enum('education_required', ['none', 'bac', 'bac+2', 'bac+3', 'bac+5'])->nullable();
            $table->json('languages_required')->nullable(); // Array of language codes
            
            // Extras
            $table->json('benefits')->nullable(); // Array of benefit strings
            $table->integer('positions_count')->default(1);
            $table->integer('views_count')->default(0);
            $table->boolean('is_urgent')->default(false);
            $table->boolean('is_active')->default(true);
            $table->date('deadline');
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('offers');
    }
};
