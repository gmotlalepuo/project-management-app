<?php

namespace App\Http\Controllers;

use App\Http\Resources\TaskResource;
use App\Models\Task;
use App\Models\TaskLabel;
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

        // Get task counts
        $totalPendingTasks = Task::visibleToUser($user->id)
            ->where('status', 'pending')->count();
        $myPendingTasks = Task::visibleToUser($user->id)
            ->where('status', 'pending')
            ->where('assigned_user_id', $user->id)->count();

        $totalProgressTasks = Task::visibleToUser($user->id)
            ->where('status', 'in_progress')->count();
        $myProgressTasks = Task::visibleToUser($user->id)
            ->where('status', 'in_progress')
            ->where('assigned_user_id', $user->id)->count();

        $totalCompletedTasks = Task::visibleToUser($user->id)
            ->where('status', 'completed')->count();
        $myCompletedTasks = Task::visibleToUser($user->id)
            ->where('status', 'completed')
            ->where('assigned_user_id', $user->id)->count();

        // Get active try with proper relations
        $query = $this->dashboardService->getActiveTasks($user, $filters);

        // Add proper sorting
        $sortField = request('sort_field', 'created_at');
        $sortDirection = request('sort_direction', 'desc');

        // Fetch label options for the filter
        $labelOptions = TaskLabel::all()->map(function ($label) {
            return ['value' => $label->id, 'label' => $label->name];
        });

        // Ensure we're loading the necessary relations
        $activeTasks = $query->with(['project', 'labels', 'assignedUser'])
            ->orderBy($sortField, $sortDirection)
            ->paginate(request('per_page', 10))
            ->withQueryString();

        return Inertia::render('Dashboard', [
            'totalPendingTasks' => $totalPendingTasks,
            'myPendingTasks' => $myPendingTasks,
            'totalProgressTasks' => $totalProgressTasks,
            'myProgressTasks' => $myProgressTasks,
            'totalCompletedTasks' => $totalCompletedTasks,
            'myCompletedTasks' => $myCompletedTasks,
            'activeTasks' => TaskResource::collection($activeTasks),
            'queryParams' => $filters ?: null,
            'success' => session('success'),
            'labelOptions' => $labelOptions,
            'permissions' => [
                'canManageTasks' => $activeTasks->first()?->project->canManageTask($user),
            ],
        ]);
    }
}
