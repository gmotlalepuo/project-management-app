<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectInvitationResource extends JsonResource {
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'due_date' => $this->due_date,
            'status' => $this->status,
            'image_path' => $this->image_path,
            'pivot' => [
                'status' => $this->pivot->status,
                'role' => $this->pivot->role, // Include role
                'created_at' => $this->pivot->created_at,
                'updated_at' => $this->pivot->updated_at,
            ],
            'createdBy' => new UserResource($this->createdBy), // Assuming you have a UserResource for consistency
            'updatedBy' => new UserResource($this->updatedBy),
        ];
    }
}
