<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Borrower extends Model
{
    use SoftDeletes;
    protected $fillable = [
        'member_id',
        'patrol_base_id',
        'principal_loan',
        'previous_payment',
        'principal_deduction',
        'monthly_interest',
        'unpaid_share_capital',
        'balance',
        'share',
        'zampen_benefits',
        'processing_fee',
        'total_deduction'
    ];

    public function member()
    {
        return $this->belongsTo(Member::class);
    }

    public function patrolBase()
    {
        return $this->belongsTo(PatrolBase::class);
    }
}
