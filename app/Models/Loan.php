<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Loan extends Model
{
    use SoftDeletes;
    protected $fillable = [
        'member_id',
        'patrol_base_id',
        'principal',
        'term_months',
        'interest_rate',
        'share_capital_rate',
        'loan_status',
    ];

    public function loanStatus()
    {
        return $this->belongsTo(LoanStatus::class);
    }

    public function member()
    {
        return $this->belongsTo(Member::class);
    }

    public function patrolBase()
    {
        return $this->belongsTo(PatrolBase::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }
}