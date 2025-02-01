<?php

namespace Database\Factories;

use App\Models\TaskLabel;
use App\Models\KanbanColumn;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Task>
 */
class TaskFactory extends Factory {
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array {
        return [
            'name' => fake()->sentence(),
            'description' => fake()->paragraph(),
            'due_date' => fake()->dateTimeBetween('now', '+1 year')->format('Y-m-d H:i:s'),
            'priority' => fake()->randomElement(['low', 'medium', 'high']),
            'image_path' => null,
            'assigned_user_id' => 1,
            'created_by' => 1,
            'updated_by' => 1,
            // Remove status field as it's now handled through status_id
        ];
    }

    public function configure() {
        return $this->afterCreating(function ($task) {
            // Get 2 random default labels (where project_id is null)
            $defaultLabels = TaskLabel::whereNull('project_id')
                ->inRandomOrder()
                ->take(2)
                ->pluck('id');

            // Attach the labels to the task
            $task->labels()->attach($defaultLabels);
        });
    }
}
