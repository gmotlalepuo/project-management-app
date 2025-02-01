<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class TaskStatusFactory extends Factory {
  public function definition(): array {
    $name = fake()->unique()->words(2, true);
    return [
      'name' => $name,
      'slug' => Str::slug($name),
      'color' => fake()->randomElement(['red', 'blue', 'green', 'yellow', 'purple']),
      'is_default' => false,
      'project_id' => null,
    ];
  }

  public function default(): static {
    return $this->state(fn(array $attributes) => [
      'is_default' => true,
    ]);
  }
}
