<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('assistantship_applicant_files', function (Blueprint $table) {
            $table->id();
            $table->foreignId('assistantship_applicant_id')->constrained('assistantship_applicants')->onDelete('cascade');
            $table->string('file_path'); // storage path
            $table->string('original_name')->nullable(); // original filename
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('assistantship_applicant_files');
    }
};
