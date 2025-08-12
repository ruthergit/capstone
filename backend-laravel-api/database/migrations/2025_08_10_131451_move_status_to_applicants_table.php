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
        // Remove from scholarships table
        Schema::table('scholarships', function (Blueprint $table) {
            $table->dropColumn('status');
        });

        // Add to applicants table
        Schema::table('applicants', function (Blueprint $table) {
            $table->string('status')->default('pending'); // adjust type & default as needed
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Rollback: remove from applicants table
        Schema::table('applicants', function (Blueprint $table) {
            $table->dropColumn('status');
        });

        // Rollback: add back to scholarships table
        Schema::table('scholarships', function (Blueprint $table) {
            $table->string('status')->default('pending');
        });
    }
};
