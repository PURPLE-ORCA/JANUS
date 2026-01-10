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
        Schema::create('profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();
            
            // Basic info
            $table->string('headline');
            $table->string('resume_path')->nullable();
            $table->string('phone');
            $table->json('skills'); // Array of skill strings
            $table->string('linkedin_url')->nullable();
            $table->string('portfolio_url')->nullable();
            
            // Location
            $table->string('city')->nullable();
            $table->string('country')->default('Morocco');
            
            // Personal
            $table->date('date_of_birth')->nullable();
            $table->string('nationality')->nullable();
            
            // Professional
            $table->integer('years_of_experience')->nullable();
            $table->string('expected_salary')->nullable(); // e.g., '25k-30k MAD'
            $table->enum('availability', [
                'immediate',
                '1_week',
                '1_month',
                'negotiable'
            ])->nullable();
            $table->enum('education_level', [
                'bac',
                'bac+2',
                'bac+3',
                'bac+5',
                'phd'
            ])->nullable();
            
            // Morocco-specific
            $table->boolean('has_driving_license')->default(false);
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('profiles');
    }
};
