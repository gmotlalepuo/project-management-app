<?php

namespace App\Http\Requests\TaskLabel;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateTaskLabelRequest extends FormRequest {
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array {
        return [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('task_labels')
                    ->where('project_id', $this->project->id)
                    ->ignore($this->label->id)
            ],
            'variant' => ['required', 'string', 'in:red,green,blue,yellow,amber,indigo,purple,pink,teal,cyan,gray'],
            'project_id' => ['nullable', 'exists:projects,id'],
        ];
    }
}
