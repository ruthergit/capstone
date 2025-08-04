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
        Schema::create('events', function (Blueprint $table) {
        $table->id();
        $table->foreignId('created_by')->constrained('users');
        $table->timestamp('org_advisor_approved_at')->nullable();
        $table->timestamp('dean_approved_at')->nullable();
        $table->timestamp('admin_approved_at')->nullable();
        $table->string('status')->default('pending');
        $table->string('event_name'); // changed from 'title'
        $table->text('short_description')->nullable();
        $table->enum('event_type', ['Online', 'Onsite']);
        $table->string('location')->nullable(); // only required if event_type is Onsite
        $table->date('proposed_date');
        $table->date('optional_date')->nullable();
        $table->string('letter_path')->nullable(); // to store file path
        $table->timestamps();
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
