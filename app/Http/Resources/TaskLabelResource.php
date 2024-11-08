<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TaskLabelResource extends JsonResource {
    public static $wrap = false;
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'bg_color_class' => $this->bg_color_class,
            'border_color_class' => $this->border_color_class,
            'text_color_class' => $this->text_color_class,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
