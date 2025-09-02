<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Loan extends Model
{
    use SoftDeletes, HasFactory;
    protected $fillable = [
        'member_id',
        'patrol_base_id',
        'principal_loan',
        'principal_deduction',
        'monthly_interest_rate',
        'monthly_interest',
        'loan_term',
        'unpaid_share_capital',
        'previous_payment',
        'status',
        'share',
        'zampen_benefits',
        'processing_fee',
        'total_deduction',
        'net_amount',
        'monthly_payment',
        'date_approved'
    ];

    public function member()
    {
        return $this->belongsTo(Member::class);
    }

    public function patrolBase()
    {
        return $this->belongsTo(PatrolBase::class);
    }

    public function schedules()
    {
        return $this->hasMany(LoanSchedule::class);
    }
}