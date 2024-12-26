<?php

namespace App\Traits;

trait SortableTrait {
  protected function applySorting($query, ?string $sortField, ?string $sortDirection, string $table) {
    if ($sortField) {
      $direction = strtolower($sortDirection ?? 'desc') === 'asc' ? 'asc' : 'desc';

      // Handle relation sorting
      if (str_contains($sortField, '.')) {
        [$relation, $field] = explode('.', $sortField);
        $query->join($relation, "$table.{$relation}_id", '=', "$relation.id")
          ->orderBy("$relation.$field", $direction)
          ->select("$table.*");
      } else {
        $query->orderBy("$table.$sortField", $direction);
      }
    }

    return $query;
  }
}
