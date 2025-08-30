<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Member extends Model
{
    use HasFactory, SoftDeletes;
    protected $fillable = [
        'last_name',
        'first_name',
        'middle_name',
        'address',
        'tin_number',
        'birthdate',
        'gender',
        'civil_status',
        'educational_attainment',
        'occupation',
        'number_of_dependents',
        'religion_id',
        'annual_income',
        'membership_number',
        'bod_resolution_number',
        'membership_type',
        'initial_capital_subscription',
        'initial_paid_up',
    ];

    public function getAgeAttribute()
    {
        return \Carbon\Carbon::parse($this->birthdate)->age;
    }

    public function attachments()
    {
        return $this->hasMany(Attachment::class);
    }

    public function loans()
    {
        return $this->hasMany(Loan::class);
    }

    public function religion()
    {
        return $this->belongsTo(Religion::class);
    }
}
