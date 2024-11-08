<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void {
        Schema::create('task_labels', function (Blueprint $table) {
            $table->id();
            $table->string('bg_color_class');
            $table->string('border_color_class');
            $table->string('text_color_class');
            $table->timestamps();
        });

        Schema::create('label_task', function (Blueprint $table) {
            $table->foreignId('task_id')->constrained()->onDelete('cascade');
            $table->foreignId('task_label_id')->constrained('task_labels')->onDelete('cascade');
            $table->primary(['task_id', 'task_label_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void {
        Schema::dropIfExists('label_task');
        Schema::dropIfExists('task_labels');
    }
};
