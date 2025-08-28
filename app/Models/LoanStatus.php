<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LoanStatus extends Model
{
    protected $fillable = ['name'];

    public function loans()
    {
        return $this->hasMany(Loan::class);
    }
}
