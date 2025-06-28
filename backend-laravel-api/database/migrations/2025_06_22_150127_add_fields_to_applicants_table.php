<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('applicants', function (Blueprint $table) {
            $table->string('pdf_path')->nullable()->after('submitted_at');
            $table->string('original_name')->nullable()->after('pdf_path');
            $table->string('user_name')->nullable()->after('original_name');
            $table->string('user_email')->nullable()->after('user_name');
        });
    }

    public function down(): void
    {
        Schema::table('applicants', function (Blueprint $table) {
            $table->dropColumn(['pdf_path', 'original_name', 'user_name', 'user_email']);
        });
    }
};