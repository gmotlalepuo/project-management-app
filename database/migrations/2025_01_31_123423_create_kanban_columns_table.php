<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  public function up(): void {
    Schema::create('kanban_columns', function (Blueprint $table) {
      $table->id();
      $table->string('name');
      $table->integer('order');
      $table->foreignId('project_id')->constrained()->cascadeOnDelete();
      $table->boolean('is_default')->default(false);
      $table->string('color')->nullable();
      $table->foreignId('task_status_id')->constrained()->cascadeOnDelete();
      $table->timestamps();
    });

    Schema::table('tasks', function (Blueprint $table) {
      $table->foreignId('kanban_column_id')->nullable()->constrained()->nullOnDelete();
    });
  }

  public function down(): void {
    // First remove the foreign key from tasks
    Schema::table('tasks', function (Blueprint $table) {
      $table->dropForeign(['kanban_column_id']);
      $table->dropColumn('kanban_column_id');
    });

    // Then drop the kanban_columns table
    Schema::dropIfExists('kanban_columns');
  }
};
