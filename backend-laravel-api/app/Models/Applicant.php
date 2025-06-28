<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Applicant extends Model
{
    use HasFactory;

    protected $fillable = [
    'user_id',
    'scholarship_id',
    'submitted_at',
    'pdf_path',
    'original_name',
    'user_name',
    'user_email',
    ];


    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function scholarship()
    {
        return $this->belongsTo(Scholarship::class);
    }
}
