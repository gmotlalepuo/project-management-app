<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Relations\Relation;

trait SortableTrait {
  protected function applySorting($query, ?string $sortField, ?string $sortDirection, string $table) {
    if ($sortField) {
      $direction = strtolower($sortDirection ?? 'desc') === 'asc' ? 'asc' : 'desc';
      $query->orderBy("$table.$sortField", $direction);
    }

    return $query;
  }
}
