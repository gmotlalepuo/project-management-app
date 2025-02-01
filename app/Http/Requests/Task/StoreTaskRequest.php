<?php

namespace App\Http\Requests\Task;

use App\Models\Project;
use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;

class StoreTaskRequest extends FormRequest {
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool {
        return true; // Authorization is now handled in the controller
    }

    protected function prepareForValidation() {
        $user = $this->user();
        $projectId = $this->input('project_id');
        $project = Project::find($projectId);

        // Convert empty string to null for assigned_user_id
        if ($this->input('assigned_user_id') === '') {
            $this->merge(['assigned_user_id' => null]);
        }

        // If user is not a project manager and tries to assign to someone else, force self-assignment
        if (
            $project && !$project->canManageTask($user) &&
            $this->input('assigned_user_id') &&
            $this->input('assigned_user_id') != $user->id
        ) {
            $this->merge(['assigned_user_id' => $user->id]);
        }
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array {
        return [
            'name' => ['required', 'string', 'max:255'],
            'image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp,svg', 'max:2048'],
            'description' => ['nullable', 'string'],
            "due_date" => ["nullable", "date"],
            'project_id' => ['required', 'exists:projects,id'],
            "assigned_user_id" => ["nullable", "exists:users,id"],
            'status_id' => ['required', 'exists:task_statuses,id'], // Replace status rule
            'priority' => ['required', Rule::in(['low', 'medium', 'high'])],
            'label_ids' => ['nullable', 'array'],
            'label_ids.*' => ['integer', 'exists:task_labels,id'],
        ];
    }
}
