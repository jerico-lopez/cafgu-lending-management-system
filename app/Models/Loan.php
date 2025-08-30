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
        'principal_loan',
        'previous_payment',
        'loan_term',
        'interest_rate',
        'unpaid_share_capital_rate',
        'status',
        'share',
        'zampen_benefits',
        'processing_fee',
    ];

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