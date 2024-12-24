<?php

use Illuminate\Support\Facades\Route;

Route::redirect('/', '/dashboard');

Route::middleware('auth')->group(function () {
    require __DIR__ . '/web/dashboard.php';
    require __DIR__ . '/web/profile.php';

    Route::middleware('verified')->group(function () {
        require __DIR__ . '/web/project-invitations.php';
        require __DIR__ . '/web/projects.php';
        require __DIR__ . '/web/tasks.php';
        require __DIR__ . '/web/task-comments.php';
        require __DIR__ . '/web/task-labels.php';
    });

    Route::middleware(['verified', 'role:admin'])->group(function () {
        require __DIR__ . '/web/admin.php';
    });
});

require __DIR__ . '/auth.php';
