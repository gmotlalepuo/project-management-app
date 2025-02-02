<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TaskStatusResource extends JsonResource {
  public static $wrap = null;

  public function toArray(Request $request): array {
    return [
      'id' => $this->id,
      'name' => $this->name,
      'slug' => $this->slug,
      'color' => $this->color,
      'project_id' => $this->project_id,
      'is_default' => $this->is_default,
      'created_at' => $this->created_at,
      'updated_at' => $this->updated_at,
      'created_by' => new UserResource($this->whenLoaded('createdBy')),
      'updated_by' => new UserResource($this->whenLoaded('updatedBy')),
    ];
  }
}
