<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class ProjectResource extends JsonResource {
    public static $wrap = null;
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array {
        // Set a flag to indicate that tasks are being accessed within the project context
        $request->merge(['projectContext' => true]);

        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'created_at' => Carbon::parse($this->created_at)
                ->setTimezone($request->header('User-Timezone', 'UTC'))
                ->toISOString(),
            'due_date' => $this->due_date ? Carbon::parse($this->due_date)
                ->setTimezone($request->header('User-Timezone', 'UTC'))
                ->toISOString() : null,
            'status' => $this->status,
            'image_path' => $this->image_path ? Storage::url($this->image_path) : "",
            'createdBy' => new UserResource($this->createdBy),
            'updatedBy' => new UserResource($this->updatedBy),
            'invitedUsers' => UserResource::collection($this->invitedUsers),
            'acceptedUsers' => UserResource::collection($this->whenLoaded('acceptedUsers')),

            // Include the latest 5 tasks with the flag to prevent recursion
            'tasks' => TaskResource::collection($this->tasks->take(5)),

            'total_tasks' => $this->total_tasks,
            'completed_tasks' => $this->completed_tasks,
        ];
    }
}
