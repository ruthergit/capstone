<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('student_org_id'); // FK to users
            $table->string('name');
            $table->text('short_description');
            $table->enum('type', ['online', 'onsite', 'outside']);
            $table->string('location')->nullable();
            $table->date('proposed_date');
            $table->date('optional_date')->nullable();
            $table->enum('status', ['pending', 'approved', 'rejected', 'revision'])->default('pending');
            $table->timestamps();

            $table->foreign('student_org_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
