<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Payment extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'loan_id',
        'loan_schedule_id',
        'amount',
        'paid_at',
        'or_number',
    ];

    protected $casts = [
        'paid_at' => 'date',
    ];

    // Relations
    public function loan()
    {
        return $this->belongsTo(Loan::class);
    }

    public function schedule()
    {
        return $this->belongsTo(LoanSchedule::class, 'loan_schedule_id');
    }
}
