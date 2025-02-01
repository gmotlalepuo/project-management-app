<?php

namespace App\Rules;

use App\Models\TaskStatus;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class ValidTaskStatus implements ValidationRule {
  protected $projectId;

  public function __construct($projectId) {
    $this->projectId = $projectId;
  }

  public function validate(string $attribute, mixed $value, Closure $fail): void {
    $status = TaskStatus::find($value);

    if (!$status) {
      $fail('The selected status is invalid.');
      return;
    }

    // Status must either belong to this project or be a default status
    if (!($status->project_id == $this->projectId || ($status->is_default && $status->project_id === null))) {
      $fail('The selected status is not valid for this project.');
    }
  }
}
