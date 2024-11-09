<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TaskLabel>
 */
class TaskLabelFactory extends Factory {
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array {
        return [
            'name' => $this->faker->word,
            'variant' => $this->faker->randomElement(['red', 'green', 'blue', 'yellow', 'amber', 'indigo', 'purple', 'pink', 'teal', 'cyan', 'gray']),
            'project_id' => null,
        ];
    }
}
