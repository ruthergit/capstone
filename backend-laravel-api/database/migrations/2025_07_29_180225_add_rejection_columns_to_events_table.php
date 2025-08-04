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
        Schema::table('events', function (Blueprint $table) {
            $table->timestamp('org_advisor_rejected_at')->nullable();
            $table->timestamp('dean_rejected_at')->nullable();
            $table->timestamp('admin_rejected_at')->nullable();
            $table->text('rejection_reason')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->dropColumn('org_advisor_rejected_at');
            $table->dropColumn('dean_rejected_at');
            $table->dropColumn('admin_rejected_at');
            $table->dropColumn('rejection_reason');
        });
    }
};
