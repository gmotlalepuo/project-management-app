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

        // Get task counts from projects where user participates (as creator or accepted member)
        $taskQuery = Task::whereHas('project', function ($query) use ($user) {
            $query->where(function ($q) use ($user) {
                $q->where('created_by', $user->id)
                    ->orWhereHas('acceptedUsers', function ($sq) use ($user) {
                        $sq->where('user_id', $user->id)
                            ->where('status', 'accepted');
                    });
            });
        });

        // Get status IDs first
        $statusIds = TaskStatus::whereIn('slug', ['pending', 'in_progress', 'completed'])
            ->pluck('id', 'slug');

        // Get total counts for all tasks in user's projects
        $totalPendingTasks = (clone $taskQuery)
            ->where('status_id', $statusIds['pending'])
            ->count();

        $totalProgressTasks = (clone $taskQuery)
            ->where('status_id', $statusIds['in_progress'])
            ->count();

        $totalCompletedTasks = (clone $taskQuery)
            ->where('status_id', $statusIds['completed'])
            ->count();

        // Get counts for tasks assigned to the user in their projects
        $myPendingTasks = (clone $taskQuery)
            ->where('assigned_user_id', $user->id)
            ->where('status_id', $statusIds['pending'])
            ->count();
        $myProgressTasks = (clone $taskQuery)
            ->where('assigned_user_id', $user->id)
            ->where('status_id', $statusIds['in_progress'])
            ->count();
        $myCompletedTasks = (clone $taskQuery)
            ->where('assigned_user_id', $user->id)
            ->where('status_id', $statusIds['completed'])
            ->count();

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
