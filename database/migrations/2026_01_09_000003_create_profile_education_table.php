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
        Schema::create('profile_education', function (Blueprint $table) {
            $table->id();
            $table->foreignId('profile_id')->constrained()->cascadeOnDelete();
            $table->string('institution'); // School/University name
            $table->string('degree'); // e.g., 'Licence', 'Master'
            $table->string('field'); // e.g., 'Computer Science'
            $table->date('start_date');
            $table->date('end_date')->nullable(); // Null = currently studying
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('profile_education');
    }
};
