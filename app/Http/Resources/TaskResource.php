<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Resources\Json\JsonResource;

class TaskResource extends JsonResource {
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
            'task_number' => $this->task_number,
            'name' => $this->name,
            'description' => $this->description,
            'created_at' => Carbon::parse($this->created_at)
                ->setTimezone($request->header('User-Timezone', 'UTC'))
                ->toISOString(),
            'due_date' => $this->due_date ? Carbon::parse($this->due_date)
                ->setTimezone($request->header('User-Timezone', 'UTC'))
                ->toISOString() : null,
            'updated_at' => Carbon::parse($this->updated_at)
                ->setTimezone($request->header('User-Timezone', 'UTC'))
                ->toISOString(),
            'status' => $this->status ? [
                'id' => $this->status->id,
                'name' => $this->status->name,
                'slug' => $this->status->slug,
                'color' => $this->status->color,
                'is_default' => $this->status->is_default,
            ] : null,
            'kanban_column' => [
                'id' => $this->kanbanColumn?->id,
                'name' => $this->kanbanColumn?->name,
                'color' => $this->kanbanColumn?->color,
            ],
            'priority' => $this->priority,
            'image_path' => $this->image_path ? Storage::url($this->image_path) : "",
            // Conditionally load the project reference to avoid circular dependency
            'project' => $this->when(!isset($request->projectContext), function () {
                return new ProjectResource($this->project);
            }),

            'project_id' => $this->project_id,
            'assigned_user_id' => $this->assigned_user_id,
            'assignedUser' => $this->assignedUser ? new UserResource($this->assignedUser) : null,
            'createdBy' => new UserResource($this->createdBy),
            'updatedBy' => new UserResource($this->updatedBy),
            'labels' => TaskLabelResource::collection($this->whenLoaded('labels')),
            'comments' => TaskCommentResource::collection($this->comments),
            'can' => [
                'edit' => $this->project->canEditTask($user, $this->resource),
                'delete' => $this->project->canDeleteTask($user),
                'assign' => $this->canBeAssignedBy($user),
                'unassign' => $this->canBeUnassignedBy($user),
                'comment' => $user->can('comment_on_tasks'),
            ],
        ];
    }
}
