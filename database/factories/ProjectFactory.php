<?php

namespace Database\Factories;

use App\Enum\RolesEnum;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Project>
 */
class ProjectFactory extends Factory {
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array {
        return [
            'name' => fake()->sentence(),
            'description' => fake()->realText(),
            'due_date' => fake()->dateTimeBetween('now', '+1 year')->format('Y-m-d H:i:s'),
            'status' => fake()->randomElement(['pending', 'in_progress', 'completed']),
            'image_path' => null,
            'created_by' => 1,
            'updated_by' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }

    public function configure() {
        return $this->afterCreating(function ($project) {
            // Attach the creator (admin) as a project manager
            $project->acceptedUsers()->attach($project->created_by, [
                'role' => 'project_manager',
                'status' => 'accepted',
            ]);

            // Create and attach another project manager if needed
            $projectManager = User::factory()->create();
            $projectManager->assignRole(RolesEnum::ProjectManager->value);
            $project->acceptedUsers()->attach($projectManager->id, [
                'role' => 'project_manager',
                'status' => 'accepted',
            ]);
        });
    }
}
