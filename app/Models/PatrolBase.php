<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PatrolBase extends Model
{
    protected $fillable = [
        'name'
    ];

    public function members()
    {
        return $this->hasMany(Borrower::class);
    }
}
