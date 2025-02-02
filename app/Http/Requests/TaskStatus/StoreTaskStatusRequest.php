<?php

namespace App\Http\Requests\TaskStatus;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTaskStatusRequest extends FormRequest {
  public function authorize(): bool {
    return true;
  }

  public function rules(): array {
    return [
      'name' => [
        'required',
        'string',
        'max:255',
        Rule::unique('task_statuses', 'name')
          ->where(function ($query) {
            return $query->where('project_id', $this->project->id)
              ->whereNotNull('project_id');
          })
      ],
      'color' => ['required', 'string', 'in:red,green,blue,yellow,amber,indigo,purple,pink,teal,cyan,gray,warning,info,success'],
      'project_id' => ['required', 'exists:projects,id'],
    ];
  }

  public function messages(): array {
    return [
      'name.unique' => 'This status name is already in use in this project.',
    ];
  }
}
