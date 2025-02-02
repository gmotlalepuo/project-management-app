<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  public function up(): void {
    Schema::create('task_statuses', function (Blueprint $table) {
      $table->id();
      $table->string('name');
      $table->string('slug');
      $table->string('color');
      $table->boolean('is_default')->default(false);
      $table->foreignId('project_id')->nullable()->constrained()->cascadeOnDelete();
      $table->foreignId('created_by')->nullable()->constrained('users');
      $table->foreignId('updated_by')->nullable()->constrained('users');
      $table->timestamps();

      // Make slug unique only within a project
      $table->unique(['slug', 'project_id']);
    });
  }

  public function down(): void {
    Schema::dropIfExists('task_statuses');
  }
};
