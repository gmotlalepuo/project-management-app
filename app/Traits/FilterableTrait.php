<?php

namespace App\Traits;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\Relation;

trait FilterableTrait {
  protected function applyNameFilter($query, string $name, string $column = 'name'): void {
    $query->where($column, 'like', "%{$name}%");
  }

  protected function applyVariantFilter($query, string $variant): void {
    $query->where('variant', $variant);
  }

  protected function applyStatusFilter($query, $statuses, string $column = 'status'): void {
    if (is_array($statuses)) {
      if ($query instanceof Relation) {
        $query->wherePivotIn($column, $statuses);
      } else {
        $query->whereIn($column, $statuses);
      }
    } else {
      if ($query instanceof Relation) {
        $query->wherePivot($column, $statuses);
      } else {
        $query->where($column, $statuses);
      }
    }
  }

  protected function applyDateRangeFilter($query, array $dateRange, string $column): void {
    $startDate = Carbon::parse($dateRange[0])->startOfDay();
    $endDate = Carbon::parse($dateRange[1])->endOfDay();
    $query->whereBetween($column, [$startDate, $endDate]);
  }

  protected function applyLabelFilter($query, $labelIds): void {
    if (is_array($labelIds)) {
      $query->whereHas('labels', function ($query) use ($labelIds) {
        $query->whereIn('id', $labelIds);
      });
    } else {
      $query->whereHas('labels', function ($query) use ($labelIds) {
        $query->where('id', $labelIds);
      });
    }
  }

  protected function applyPriorityFilter($query, $priorities): void {
    if (is_array($priorities)) {
      $query->whereIn('priority', $priorities);
    } else {
      $query->where('priority', $priorities);
    }
  }

  protected function applyRelationFilter($query, string $relation, string $column, string $value): void {
    $query->whereHas($relation, function ($query) use ($column, $value) {
      $query->where($column, 'like', "%{$value}%");
    });
  }
}
