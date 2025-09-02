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
        'birth_date',
        'gender',
        'civil_status',
        'educational_attainment',
        'occupation',
        'number_of_dependents',
        'religion',
        'annual_income',
        'membership_number',
        'bod_resolution_number',
        'membership_type',
        'initial_capital_subscription',
        'initial_paid_up',
        'afp_issued_id',
    ];

    protected $appends = ['age', 'name'];

    public function getAgeAttribute()
    {
        return \Carbon\Carbon::parse($this->birth_date)->age;
    }

    public function getNameAttribute()
    {
        if ($this->middle_name) {
            return "{$this->first_name} {$this->middle_name} {$this->last_name}";
        }
        return "{$this->first_name} {$this->last_name}";
    }

    public function attachments()
    {
        return $this->hasMany(Attachment::class);
    }

    public function loans()
    {
        return $this->hasMany(Loan::class);
    }
}