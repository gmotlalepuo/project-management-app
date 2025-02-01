<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  public function up(): void {
    Schema::create('status_task', function (Blueprint $table) {
      $table->foreignId('task_id')->constrained()->cascadeOnDelete();
      $table->foreignId('task_status_id')->constrained()->cascadeOnDelete();
      $table->timestamps();
      $table->primary(['task_id', 'task_status_id']);
    });
  }

  public function down(): void {
    Schema::dropIfExists('status_task');
  }
};
