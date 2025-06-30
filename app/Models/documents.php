<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class documents extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'revenue',
        'year',
        'gross_profit',
        'net_profit',
        'tax',
        'expenses',
        'file_path',
        'file_type',
    ];
}
