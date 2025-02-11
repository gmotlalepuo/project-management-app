<?php

namespace App\Services;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Carbon\Carbon;

abstract class BaseService {
  protected function handleImageUpload($image, string $folder, ?string $oldImagePath = null): string {
    if ($oldImagePath) {
      Storage::disk('public')->deleteDirectory(dirname($oldImagePath));
    }
    return $image->store($folder . '/' . Str::random(10), 'public');
  }

  protected function formatDate(?string $date): ?string {
    return $date ? Carbon::parse($date)->setTimezone('UTC') : null;
  }

  protected function getBasicFilters(array $filters): array {
    return [
      'sort_field' => $filters['sort_field'] ?? 'created_at',
      'sort_direction' => in_array(strtolower($filters['sort_direction'] ?? ''), ['asc', 'desc'])
        ? strtolower($filters['sort_direction'])
        : 'desc',
      'per_page' => (int)($filters['per_page'] ?? 10),
      'page' => (int)($filters['page'] ?? 1),
    ];
  }

  protected function applySorting($query, ?string $sortField, ?string $sortDirection, string $table) {
    if ($sortField) {
      $direction = strtolower($sortDirection) === 'asc' ? 'asc' : 'desc';
      $query->orderBy("$table.$sortField", $direction);
    }

    return $query;
  }

  protected function paginateAndSort($query, array $filters, string $table) {
    $perPage = (int)($filters['per_page'] ?? 10);
    $page = (int)($filters['page'] ?? 1);

    // Apply sorting before pagination
    if (isset($filters['sortField'])) {
      // Clone the query to maintain the original query state
      $sortQuery = clone $query;

      if (str_contains($filters['sortField'], '.')) {
        // Handle relation sorting
        [$relation, $field] = explode('.', $filters['sortField']);
        $sortQuery->join($relation, "$table.{$relation}_id", '=', "$relation.id")
          ->orderBy("$relation.$field", $filters['sortDirection'] ?? 'desc')
          ->select("$table.*");
      } else {
        // Regular column sorting
        $sortQuery->orderBy(
          "$table.{$filters['sortField']}",
          $filters['sortDirection'] ?? 'desc'
        );
      }

      return $sortQuery->paginate($perPage, ['*'], 'page', $page);
    }

    // Default sorting by updated_at
    return $query->orderBy("$table.updated_at", 'desc')
      ->paginate($perPage, ['*'], 'page', $page);
  }

  protected function paginateQuery($query, $perPage = 10) {
    return $query->paginate($perPage)->withQueryString();
  }
}
