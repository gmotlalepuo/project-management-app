<?php

use Illuminate\Support\Facades\Route;

Route::get('/storage/{path}', function ($path) {
    $fullPath = storage_path('app/public/' . $path);

    if (!file_exists($fullPath)) {
        abort(404);
    }

    return response()->file($fullPath, [
        'Cache-Control' => 'public, max-age=31536000, immutable',
        'Pragma' => 'public',
        'Expires' => gmdate('D, d M Y H:i:s \G\M\T', time() + 31536000),
    ]);
})->where('path', '.*')->middleware('cache.images');

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
