<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Database\Eloquent\Builder;

class HandleInertiaRequests extends Middleware {
    protected $rootView = 'app';

    // Add routes that need full data loading
    protected $fullDataRoutes = [
        'dashboard',
        'project.index',
        'task.index',
        'task.myTasks'
    ];

    // Add routes that need base data (recent items only)
    protected $baseDataRoutes = [
        'project.show',
        'project.edit',
        'project.create',
        'task.show',
        'task.edit',
        'task.create',
    ];

    public function share(Request $request): array {
        $user = $request->user();
        $routeName = $request->route()?->getName();

        // Early return for unauthenticated users
        if (!$user) {
            return $this->getBaseShare($request);
        }

        $needsFullData = in_array($routeName, $this->fullDataRoutes);
        $needsBaseData = in_array($routeName, $this->baseDataRoutes);

        return array_merge(
            $this->getBaseShare($request),
            $this->getAuthShare($user),
            $this->getMinimalDataShare($user), // Always include minimal data
            $needsFullData ? $this->getFullDataShare($user) : []
        );
    }

    protected function getBaseShare(Request $request): array {
        return [
            ...parent::share($request),
            'timezone' => $request->header('User-Timezone', 'UTC'),
            'ziggy' => fn() => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
        ];
    }

    protected function getAuthShare($user): array {
        return [
            'auth' => [
                'user' => $user ? [
                    ...$user->only(['id', 'name', 'email']),
                    'permissions' => $user->getPermissionNames()->toArray(),
                    'roles' => $user->getRoleNames()->toArray(),
                ] : null,
            ],
        ];
    }

    // Add new method for minimal shared data
    protected function getMinimalDataShare($user): array {
        // Get recent projects with optimized query
        $recentProjects = Project::query()
            ->where(function (Builder $query) use ($user) {
                $query->where('created_by', $user->id)
                    ->orWhereHas('acceptedUsers', function ($query) use ($user) {
                        $query->where('user_id', $user->id);
                    });
            })
            ->select('id', 'name', 'status', 'created_by')
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

        // Get recent tasks with optimized query
        $recentTasks = Task::query()
            ->where('assigned_user_id', $user->id)
            ->select('id', 'name', 'project_id', 'status')
            ->with([
                'labels:id,name,variant',
                'project:id,name'
            ])
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

        return [
            'recentProjects' => $recentProjects,
            'recentTasks' => $recentTasks,
        ];
    }

    protected function getFullDataShare($user): array {
        return [
            'allProjects' => $this->shouldLoadAllProjects() ? $this->getAllProjects($user) : [],
            'allTasks' => $this->shouldLoadAllTasks() ? $this->getAllTasks($user) : [],
        ];
    }

    protected function shouldLoadAllProjects(): bool {
        return in_array(request()->route()?->getName(), [
            'dashboard',
            'project.index'
        ]);
    }

    protected function shouldLoadAllTasks(): bool {
        return in_array(request()->route()?->getName(), [
            'dashboard',
            'task.index',
            'task.myTasks'
        ]);
    }

    protected function getAllProjects($user) {
        return Project::query()
            ->where(function (Builder $query) use ($user) {
                $query->where('created_by', $user->id)
                    ->orWhereHas('acceptedUsers', function ($query) use ($user) {
                        $query->where('user_id', $user->id);
                    });
            })
            ->select('id', 'name', 'status', 'created_by', 'updated_at')
            ->withCount([
                'tasks as total_tasks',
                'tasks as completed_tasks' => function ($query) {
                    $query->where('status', 'completed');
                }
            ])
            ->with([
                'tasks' => function ($query) {
                    $query->select('id', 'project_id', 'name', 'status')
                        ->with('labels:id,name,variant')
                        ->orderBy('created_at', 'desc');
                }
            ])
            ->orderBy('updated_at', 'desc')
            ->get();
    }

    protected function getAllTasks($user) {
        return Task::query()
            ->where('assigned_user_id', $user->id)
            ->select('id', 'name', 'status', 'project_id')
            ->with('labels:id,name,variant')
            ->get();
    }
}
