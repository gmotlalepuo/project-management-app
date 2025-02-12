<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Cache;

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
        if (!$user) {
            return ['auth' => ['user' => null]];
        }

        // Cache the user's avatar
        $avatarCacheKey = "user_{$user->id}_avatar";
        $avatar = Cache::remember($avatarCacheKey, now()->addDay(), function () use ($user) {
            return $user->profile_picture;
        });

        return [
            'auth' => [
                'user' => [
                    ...$user->toArray(),
                    'profile_picture' => $avatar,
                    'permissions' => $user->getPermissionNames()->toArray(),
                    'roles' => $user->getRoleNames()->toArray(),
                ],
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
            ->select('id', 'name', 'project_id', 'status_id', 'assigned_user_id')
            ->with([
                'labels:id,name,variant',
                'status:id,name,slug,color',
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
                    'status' => $task->status,
                    'url' => route('task.show', $task->id),
                    'permissions' => [
                        'canDelete' => $task->project->canDeleteTask($user, $task),
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
                    $query->whereHas('status', function ($q) {
                        $q->where('slug', 'completed');
                    });
                }
            ])
            ->with([
                'tasks' => function ($query) {
                    $query->select('id', 'project_id', 'name', 'status_id', 'updated_at')
                        ->with([
                            'labels:id,name,variant',
                            'status:id,name,slug,color'
                        ])
                        ->orderByDesc('updated_at');
                }
            ])
            ->orderBy('updated_at', 'desc')
            ->get();
    }

    protected function getAllTasks($user) {
        return Task::query()
            ->where('assigned_user_id', $user->id)
            ->select('id', 'name', 'status_id', 'project_id')
            ->with([
                'labels:id,name,variant',
                'status:id,name,slug,color',
            ])
            ->get();
    }
}
