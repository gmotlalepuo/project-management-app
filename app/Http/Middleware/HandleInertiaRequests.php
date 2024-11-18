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

        if ($user) {
            $recentProjects = Project::where('created_by', $user->id)
                ->orWhereHas('acceptedUsers', function ($query) use ($user) {
                    $query->where('user_id', $user->id);
                })
                ->orderBy('updated_at', 'desc')
                ->limit(3)
                ->get();

            $recentTasks = Task::where('assigned_user_id', $user->id)
                ->with('labels')
                ->orderBy('updated_at', 'desc')
                ->limit(3)
                ->get();
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user,
            ],
            'timezone' => $request->header('User-Timezone', 'UTC'),
            'ziggy' => fn() => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            'recentProjects' => $recentProjects,
            'recentTasks' => $recentTasks,
        ];
    }
}
