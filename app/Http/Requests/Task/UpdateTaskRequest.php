<?php

namespace App\Http\Requests\Task;

use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateTaskRequest extends FormRequest {
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool {
        $user = $this->user();
        $task = $this->route('task');
        $project = $task->project;

        if (!$project->canEditTask($user, $task)) {
            return false;
        }

        // If not a project manager, ensure they're not trying to change the assignee
        if (
            !$project->canManageTask($user) &&
            $this->has('assigned_user_id') &&
            $this->input('assigned_user_id') != $task->assigned_user_id
        ) {
            return false;
        }

        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array {
        return [
            // Ensure project_id matches the current task's project_id
            'project_id' => ['required', 'exists:projects,id', 'in:' . $this->route('task')->project_id],
            'name' => ['required', 'string', 'max:255'],
            'image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp,svg', 'max:2048'],
            'description' => ['nullable', 'string'],
            "due_date" => ["nullable", "date"],
            "assigned_user_id" => ["nullable", "exists:users,id"],
            'status' => ['required', Rule::in(['pending', 'in_progress', 'completed'])],
            'priority' => ['required', Rule::in(['low', 'medium', 'high'])],
            'label_ids' => ['nullable', 'array'],
            'label_ids.*' => ['integer', 'exists:task_labels,id'],
        ];
    }

    protected function prepareForValidation() {
        // Convert empty string, "unassigned", or falsy values to null for assigned_user_id
        if (empty($this->input('assigned_user_id')) || $this->input('assigned_user_id') === 'unassigned') {
            $this->merge(['assigned_user_id' => null]);
        }
    }
}
