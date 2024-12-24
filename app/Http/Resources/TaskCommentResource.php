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
      'parent_id' => $this->parent_id,
      'replies' => $this->whenLoaded('replies', function () {
        return self::collection($this->replies->sortBy('created_at'));
      }),
      'can' => [
        'edit' => $user->can('update', $this->resource),
        'delete' => $user->can('delete', $this->resource),
        'reply' => $user->can('create', TaskComment::class),
      ],
    ];
  }
}
