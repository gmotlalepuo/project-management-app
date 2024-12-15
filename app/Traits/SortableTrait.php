<?php

namespace App\Traits;

trait SortableTrait {
  protected function applySorting($query, ?string $sortField, ?string $sortDirection, string $table) {
    if ($sortField) {
      $direction = strtolower($sortDirection ?? 'desc') === 'asc' ? 'asc' : 'desc';
      $query->orderBy("$table.$sortField", $direction);
    }

    return $query;
  }
}
