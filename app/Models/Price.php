<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Price extends Model
{
    use HasFactory;

    protected $fillable = [
        'type',
        'price',
        'description',
        'start_date',
        'end_date',
    ];

    protected $table = 'prices';

    public $timestamps = false;
}
