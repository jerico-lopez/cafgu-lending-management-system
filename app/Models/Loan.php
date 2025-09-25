<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
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
        'monthly_interest',
        'unpaid_share_capital',
        'previous_payment',
        'status',
        'share',
        'zampen_benefits',
        'processing_fee',
        'total_deduction',
        'monthly_payment',
        'date_approved'
    ];

    protected $appends = ['total_collectibles', 'collectibles_this_month'];

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

    protected function totalCollectibles(): Attribute
    {
        return Attribute::get(fn () =>
            $this->schedules()->whereNull('paid_at')->sum('amount')
        );
    }

    protected function collectiblesThisMonth(): Attribute
    {
        return Attribute::get(fn () =>
            $this->schedules()
                ->whereNull('paid_at')
                ->whereMonth('due_date', now()->month)
                ->whereYear('due_date', now()->year)
                ->sum('amount')
        );
    }
}