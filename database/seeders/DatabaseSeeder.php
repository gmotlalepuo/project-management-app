<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Project;
use App\Models\TaskLabel;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder {
    /**
     * Seed the application's database.
     */
    public function run(): void {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Stefan',
            'email' => 'stefan@example.com',
            'password' => bcrypt('password1'),
            'email_verified_at' => time(),
        ]);

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

        // Project::factory()->count(30)->hasTasks(30)->create();
    }
}
