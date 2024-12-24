<?php

use App\Enum\PermissionsEnum;
use App\Http\Controllers\TaskCommentController;
use Illuminate\Support\Facades\Route;

Route::prefix('task/{task}/comments')->name('task.comments.')->group(function () {
  Route::post('/', [TaskCommentController::class, 'store'])
    ->name('store')->middleware('permission:' . PermissionsEnum::CommentOnTasks->value);
  Route::put('/{comment}', [TaskCommentController::class, 'update'])->name('update');
  Route::delete('/{comment}', [TaskCommentController::class, 'destroy'])->name('destroy');
});
