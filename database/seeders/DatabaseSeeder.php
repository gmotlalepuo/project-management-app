<?php

namespace Database\Seeders;

use App\Enum\PermissionsEnum;
use App\Enum\RolesEnum;
use App\Models\User;
use App\Models\Project;
use App\Models\TaskLabel;
use App\Models\KanbanColumn;
use App\Models\Task;
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
        $genericLabels = [
            ['name' => 'Bug', 'variant' => 'red'],
            ['name' => 'Feature Request', 'variant' => 'blue'],
            ['name' => 'Improvement', 'variant' => 'green'],
            ['name' => 'Documentation', 'variant' => 'yellow'],
            ['name' => 'Testing', 'variant' => 'purple'],
        ];

        foreach ($genericLabels as $label) {
            TaskLabel::create(array_merge($label, ['project_id' => null]));
        }

        // Create projects first without tasks
        Project::factory()
            ->count(30)
            ->create([
                'created_by' => $user->id // This ensures the admin user is the creator
            ]);

        // Create default kanban columns for each project
        Project::all()->each(function ($project) {
            $columns = [
                [
                    'name' => 'To Do',
                    'order' => 0,
                    'is_default' => true,
                    'maps_to_status' => 'pending',
                    'color' => 'yellow',
                ],
                [
                    'name' => 'In Progress',
                    'order' => 1,
                    'is_default' => true,
                    'maps_to_status' => 'in_progress',
                    'color' => 'blue',
                ],
                [
                    'name' => 'Done',
                    'order' => 2,
                    'is_default' => true,
                    'maps_to_status' => 'completed',
                    'color' => 'green',
                ]
            ];

            foreach ($columns as $column) {
                KanbanColumn::create([
                    'project_id' => $project->id,
                    ...$column,
                ]);
            }

            // Create tasks after columns exist
            $project->tasks()->createMany(
                Task::factory()->count(30)->make()->map(function ($task) use ($project) {
                    $column = $project->kanbanColumns()
                        ->where('maps_to_status', $task->status)
                        ->first();

                    return array_merge($task->toArray(), [
                        'kanban_column_id' => $column->id
                    ]);
                })->toArray()
            );
        });
    }
}
