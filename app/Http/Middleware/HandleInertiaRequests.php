<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;
use App\Models\Project;
use App\Models\Task;

class HandleInertiaRequests extends Middleware {
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array {
        $user = $request->user();
        $recentProjects = collect();
        $recentTasks = collect();
        $allProjects = collect();
        $allTasks = collect();

        if ($user) {
            $recentProjects = Project::where('created_by', $user->id)
                ->orWhereHas('acceptedUsers', function ($query) use ($user) {
                    $query->where('user_id', $user->id);
                })
                ->orderBy('updated_at', 'desc')
                ->limit(3)
                ->get()
                ->map(function ($project) use ($user) {
                    return [
                        'id' => $project->id,
                        'name' => $project->name,
                        'status' => $project->status,
                        'url' => route('project.show', $project->id),
                        'permissions' => [
                            'canEdit' => $project->canEditProject($user),
                            'isCreator' => $project->created_by === $user->id,
                        ]
                    ];
                });

            $recentTasks = Task::where('assigned_user_id', $user->id)
                ->with(['labels', 'project']) // Add project relationship
                ->orderBy('updated_at', 'desc')
                ->limit(3)
                ->get()
                ->map(function ($task) use ($user) {
                    return [
                        'id' => $task->id,
                        'name' => $task->name,
                        'labels' => $task->labels,
                        'url' => route('task.show', $task->id),
                        'permissions' => [
                            'canDelete' => $task->project->canDeleteTask($user),
                        ],
                    ];
                });

            // Update the allProjects query to include task counts
            $allProjects = Project::where('created_by', $user->id)
                ->orWhereHas('acceptedUsers', function ($query) use ($user) {
                    $query->where('user_id', $user->id);
                })
                ->withCount([
                    'tasks as total_tasks',
                    'tasks as completed_tasks' => function ($query) {
                        $query->where('status', 'completed');
                    }
                ])
                ->with(['tasks' => function ($query) {
                    $query->with('labels')->orderBy('updated_at', 'desc');
                }])
                ->orderBy('updated_at', 'desc')
                ->get();

            $allTasks = Task::where('assigned_user_id', $user->id)
                ->with('labels')
                ->get();
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user ? array_merge($user->toArray(), [
                    'permissions' => $user->getPermissionNames()->toArray(),
                    'roles' => $user->getRoleNames()->toArray(),
                ]) : null,
            ],
            'timezone' => $request->header('User-Timezone', 'UTC'),
            'ziggy' => fn() => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            'recentProjects' => $recentProjects,
            'recentTasks' => $recentTasks,
            'allProjects' => $allProjects, // Share all projects
            'allTasks' => $allTasks, // Share all tasks
        ];
    }
}
