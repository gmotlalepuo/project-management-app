<?php

namespace App\Traits;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

trait ImageTrait {
  protected function getImageUrl(?string $path): ?string {
    if (!$path) {
      return null;
    }

    $url = Storage::url($path);

    // Add cache busting only in development
    if (app()->environment('local')) {
      $url .= '?v=' . Str::random(6);
    }

    return $url;
  }

  protected function storeImage($file, string $folder): string {
    $path = $file->store($folder . '/' . Str::random(10), 'public');

    // Set proper file permissions
    Storage::disk('public')->setVisibility($path, 'public');

    return $path;
  }

  protected function deleteImage(?string $path): void {
    if ($path && Storage::disk('public')->exists($path)) {
      Storage::disk('public')->delete($path);
    }
  }
}
