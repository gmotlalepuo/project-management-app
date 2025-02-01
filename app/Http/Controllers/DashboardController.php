<?php

namespace App\Http\Controllers;

use App\Http\Resources\TaskResource;
use App\Models\Task;
use App\Models\TaskStatus;
use App\Services\DashboardService;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller {
    protected $dashboardService;

    public function __construct(DashboardService $dashboardService) {
        $this->dashboardService = $dashboardService;
    }

    public function index() {
        $user = Auth::user();
        $filters = request()->all();

        // Initialize task counts with status IDs instead of slugs
        $pendingStatus = \App\Models\TaskStatus::where('slug', 'pending')->first();
        $inProgressStatus = \App\Models\TaskStatus::where('slug', 'in_progress')->first();
        $completedStatus = \App\Models\TaskStatus::where('slug', 'completed')->first();

        $taskQuery = Task::whereHas('project', function ($query) use ($user) {
            $query->visibleToUser($user->id);
        });

        $totalPendingTasks = (clone $taskQuery)->where('status_id', $pendingStatus->id)->count();
        $myPendingTasks = (clone $taskQuery)->where('status_id', $pendingStatus->id)
            ->where('assigned_user_id', $user->id)->count();

        $totalProgressTasks = (clone $taskQuery)->where('status_id', $inProgressStatus->id)->count();
        $myProgressTasks = (clone $taskQuery)->where('status_id', $inProgressStatus->id)
            ->where('assigned_user_id', $user->id)->count();

        $totalCompletedTasks = (clone $taskQuery)->where('status_id', $completedStatus->id)->count();
        $myCompletedTasks = (clone $taskQuery)->where('status_id', $completedStatus->id)
            ->where('assigned_user_id', $user->id)->count();

        // Get active tasks and apply sorting/pagination
        $query = $this->dashboardService->getActiveTasks($user, $filters);
        $activeTasks = $this->dashboardService->paginateAndSort($query, $filters, 'tasks');

        $options = $this->dashboardService->getOptions($user);

        return Inertia::render('Dashboard/Index', [
            'totalPendingTasks' => $totalPendingTasks,
            'myPendingTasks' => $myPendingTasks,
            'totalProgressTasks' => $totalProgressTasks,
            'myProgressTasks' => $myProgressTasks,
            'totalCompletedTasks' => $totalCompletedTasks,
            'myCompletedTasks' => $myCompletedTasks,
            'activeTasks' => TaskResource::collection($activeTasks),
            'queryParams' => $filters ?: null,
            'success' => session('success'),
            'labelOptions' => $options['labelOptions'],
            'projectOptions' => $options['projectOptions'],
            'statusOptions' => $options['statusOptions'],
            'permissions' => [
                'canManageTasks' => $activeTasks->first()?->project->canManageTask($user),
            ],
        ]);
    }
}
