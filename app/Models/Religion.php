<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Religion extends Model
{
    use SoftDeletes;
    protected $fillable = [
        'name'
    ];

    public function members()
    {
        return $this->hasMany(Member::class);
    }
}
