<?php

namespace App\Http\Resources;

use App\Models\TaskComment;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TaskCommentResource extends JsonResource {
  public static $wrap = false;
  /**
   * Transform the resource into an array.
   *
   * @return array<string, mixed>
   */
  public function toArray(Request $request): array {
    $user = $request->user();

    return [
      'id' => $this->id,
      'content' => $this->content,
      'is_edited' => $this->is_edited,
      'created_at' => $this->created_at->toISOString(),
      'updated_at' => $this->updated_at->toISOString(),
      'user' => new UserResource($this->user),
      'replies' => self::collection($this->whenLoaded('replies')),
      'can' => [
        'edit' => $user->can('update', $this->resource),
        'delete' => $user->can('delete', $this->resource),
        'reply' => $user->can('create', TaskComment::class),
      ],
    ];
  }
}
