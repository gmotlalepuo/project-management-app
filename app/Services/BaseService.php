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
    $basicFilters = $this->getBasicFilters($filters);

    if (str_contains($basicFilters['sort_field'], '.')) {
      // Handle relation sorting
      [$relation, $field] = explode('.', $basicFilters['sort_field']);
      $query->join($relation, "$table.{$relation}_id", '=', "$relation.id")
        ->select("$table.*")
        ->orderBy("$relation.$field", $basicFilters['sort_direction']);
    } else {
      // Normal column sorting
      $query = $this->applySorting($query, $basicFilters['sort_field'], $basicFilters['sort_direction'], $table);
    }

    return $query->paginate($basicFilters['per_page'], ['*'], 'page', $basicFilters['page']);
  }
}
