<?php

namespace Database\Seeders;

use App\Enum\PermissionsEnum;
use App\Enum\RolesEnum;
use App\Models\User;
use App\Models\Project;
use App\Models\TaskLabel;
use App\Models\KanbanColumn;
use App\Models\Task;
use App\Models\TaskStatus;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder {
    /**
     * Seed the application's database.
     */
    public function run(): void {
        // Create permissions
        $permissions = [
            PermissionsEnum::ManageProjects->value,
            PermissionsEnum::ManageTasks->value,
            PermissionsEnum::ManageUsers->value,
            PermissionsEnum::ViewProjects->value,
            PermissionsEnum::ViewTasks->value,
            PermissionsEnum::CommentOnTasks->value,
            PermissionsEnum::DeleteComments->value,
            PermissionsEnum::ManageComments->value,
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        // Create roles and assign permissions
        $adminRole = Role::create(['name' => RolesEnum::Admin->value]);
        $adminRole->givePermissionTo(Permission::all());

        $projectManagerRole = Role::create(['name' => RolesEnum::ProjectManager->value]);
        $projectManagerRole->givePermissionTo([
            PermissionsEnum::ManageProjects->value,
            PermissionsEnum::ManageTasks->value,
            PermissionsEnum::ViewProjects->value,
            PermissionsEnum::ViewTasks->value,
            PermissionsEnum::CommentOnTasks->value,
            PermissionsEnum::DeleteComments->value,
            PermissionsEnum::ManageComments->value,
        ]);

        $projectMemberRole = Role::create(['name' => RolesEnum::ProjectMember->value]);
        $projectMemberRole->givePermissionTo([
            PermissionsEnum::ViewProjects->value,
            PermissionsEnum::ViewTasks->value,
            PermissionsEnum::CommentOnTasks->value,
            PermissionsEnum::DeleteComments->value,
            PermissionsEnum::ManageTasks->value,
        ]);

        // Create a sample user
        $user = User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'password' => bcrypt('password1'),
            'email_verified_at' => time(),
        ]);

        // Assign both admin and project manager roles
        $user->assignRole([RolesEnum::Admin->value, RolesEnum::ProjectManager->value]);
        $user->syncPermissions(Permission::all());

        // Seed generic task labels
        $genericLabels = collect([
            ['name' => 'Bug', 'variant' => 'red'],
            ['name' => 'Feature Request', 'variant' => 'blue'],
            ['name' => 'Improvement', 'variant' => 'green'],
            ['name' => 'Documentation', 'variant' => 'yellow'],
            ['name' => 'Testing', 'variant' => 'purple'],
        ])->map(function ($label) {
            return TaskLabel::create(array_merge($label, ['project_id' => null]));
        });

        // Create default task statuses first
        $defaultStatuses = [
            [
                'name' => 'Pending',
                'slug' => 'pending',
                'color' => 'warning', // Match badge variant
                'is_default' => true,
                'project_id' => null, // Global status
            ],
            [
                'name' => 'In Progress',
                'slug' => 'in_progress',
                'color' => 'info', // Match badge variant
                'is_default' => true,
                'project_id' => null,
            ],
            [
                'name' => 'Completed',
                'slug' => 'completed',
                'color' => 'success', // Match badge variant
                'is_default' => true,
                'project_id' => null,
            ],
        ];

        $globalStatuses = collect($defaultStatuses)->map(fn($status) => TaskStatus::create($status));

        // Create projects with kanban columns linked to global statuses
        Project::factory()
            ->count(30)
            ->create(['created_by' => $user->id])
            ->each(function ($project) use ($globalStatuses, $genericLabels) {
                // Create kanban columns linked to global statuses
                $globalStatuses->each(function ($status, $index) use ($project) {
                    KanbanColumn::create([
                        'name' => $status->name,
                        'order' => $index,
                        'project_id' => $project->id,
                        'task_status_id' => $status->id,
                        'color' => $status->color,
                        'is_default' => true,
                    ]);
                });

                // Create tasks with references to random global statuses and attach random labels
                $tasks = Task::factory()
                    ->count(30)
                    ->make()
                    ->map(function ($task) use ($project, $globalStatuses) {
                        $status = $globalStatuses->random();
                        $column = $project->kanbanColumns()
                            ->where('task_status_id', $status->id)
                            ->first();

                        return array_merge($task->toArray(), [
                            'project_id' => $project->id,
                            'status_id' => $status->id,
                            'kanban_column_id' => $column->id,
                        ]);
                    });

                // Create tasks and attach labels
                $project->tasks()->createMany($tasks)->each(function ($task) use ($genericLabels) {
                    $randomLabels = $genericLabels->random(rand(1, 3));
                    $task->labels()->attach($randomLabels->pluck('id'));
                });
            });
    }
}
