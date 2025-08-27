<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attachment extends Model
{
    protected $fillable =[
        "user_id",
        "file_name",
        "file_path"
    ];

    public function member()
    {
        return $this->belongsTo(Member::class);
    }
}
