<?php

use Illuminate\Support\Facades\Route;

Route::redirect('/', '/dashboard');

Route::middleware(['auth', 'verified'])->group(function () {
    require __DIR__ . '/web/dashboard.php';
    require __DIR__ . '/web/profile.php';
    require __DIR__ . '/web/project-invitations.php';
    require __DIR__ . '/web/projects.php';
    require __DIR__ . '/web/tasks.php';
    require __DIR__ . '/web/task-comments.php';
    require __DIR__ . '/web/task-labels.php';
    require __DIR__ . '/web/task-statuses.php';
    require __DIR__ . '/web/kanban.php';

    Route::middleware('role:admin')->group(function () {
        require __DIR__ . '/web/admin.php';
    });
});

require __DIR__ . '/auth.php';
