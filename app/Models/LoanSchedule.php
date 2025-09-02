<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class LoanSchedule extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'loan_id',
        'month_no',
        'due_date',
        'paid_at'
    ];

    public function loan()
    {
        return $this->belongsTo(Loan::class);
    }

    public function isPaid()
    {
        return $this->payments()->sum('amount') >= $this->total_deduction;
    }
}
