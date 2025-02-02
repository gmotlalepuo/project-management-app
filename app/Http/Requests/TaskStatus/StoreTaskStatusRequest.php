<?php

namespace App\Http\Requests\TaskStatus;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTaskStatusRequest extends FormRequest {
  public function authorize(): bool {
    return true; // Authorization handled by middleware
  }

  public function rules(): array {
    return [
      'name' => [
        'required',
        'string',
        'max:255',
        Rule::unique('task_statuses')
          ->where('project_id', $this->project->id)
      ],
      'color' => ['required', 'string', 'in:red,green,blue,yellow,amber,indigo,purple,pink,teal,cyan,gray,warning,info,success'],
    ];
  }
}
