<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('event_files', function (Blueprint $table) {
            $table->string('original_name')->nullable();
            $table->string('file_type')->nullable();
            $table->unsignedBigInteger('file_size')->nullable();
        });
    }

    public function down()
    {
        Schema::table('event_files', function (Blueprint $table) {
            $table->dropColumn(['original_name', 'file_type', 'file_size']);
        });
    }

};
