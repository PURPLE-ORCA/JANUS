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
        Schema::create('applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('offer_id')->constrained()->cascadeOnDelete();
            
            // Extended status flow
            $table->enum('status', [
                'new',
                'viewed',
                'shortlisted',
                'interview',
                'offered',
                'rejected',
                'hired',
                'withdrawn'
            ])->default('new');
            
            // Application details
            $table->text('cover_note')->nullable(); // Candidate's message
            $table->json('screener_responses')->nullable(); // Answers to screener questions
            $table->string('rejection_reason')->nullable(); // Why rejected
            $table->datetime('interview_at')->nullable(); // Scheduled interview
            
            $table->timestamps();
            
            // One application per job per user
            $table->unique(['user_id', 'offer_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('applications');
    }
};
