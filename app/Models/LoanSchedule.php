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
        'principal_deduction',
        'monthly_interest',
        'unpaid_share_capital',
        'total_deduction',
    ];
}
