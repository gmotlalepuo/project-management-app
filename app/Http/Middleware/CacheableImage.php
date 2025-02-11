<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CacheableImage {
  protected $cacheableExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];

  public function handle(Request $request, Closure $next): Response {
    $response = $next($request);

    if ($this->isImageRequest($request) && $response instanceof Response) {
      $response->headers->add([
        'Cache-Control' => 'public, max-age=31536000, immutable',
        'Pragma' => 'public',
        'Expires' => gmdate('D, d M Y H:i:s \G\M\T', time() + 31536000),
      ]);
    }

    return $response;
  }

  protected function isImageRequest(Request $request): bool {
    $path = $request->path();
    $extension = strtolower(pathinfo($path, PATHINFO_EXTENSION));
    return in_array($extension, $this->cacheableExtensions);
  }
}
