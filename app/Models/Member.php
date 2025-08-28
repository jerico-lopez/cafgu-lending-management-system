<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Member extends Model
{
    use SoftDeletes;
    protected $fillable = [
        'last_name',
        'first_name',
        'middle_name',
        'address',
        'tin_number',
        'birthdate',
        'gender_id',
        'civil_status_id',
        'educational_attainment',
        'occupation',
        'number_of_dependents',
        'religion_id',
        'annual_income',
        'membership_number',
        'bod_relationship',
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

    public function borrowers()
    {
        return $this->hasMany(Borrower::class);
    }

    public function civilStatus()
    {
        return $this->belongsTo(CivilStatus::class);
    }

    public function gender()
    {
        return $this->belongsTo(Gender::class);
    }

    public function religion()
    {
        return $this->belongsTo(Religion::class);
    }
}
