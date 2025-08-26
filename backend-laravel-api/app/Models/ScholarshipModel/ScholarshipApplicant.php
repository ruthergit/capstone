<?php

namespace App\Models\ScholarshipModel;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\ScholarshipModel\Scholarship;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ScholarshipApplicant extends Model
{
    use HasFactory;

    protected $table = 'scholarshipApplicants';
    protected $fillable = [
    'user_id',
    'scholarship_id',
    'submitted_at',
    'pdf_path',
    'original_name',
    'status',
    'user_name',
    'user_email',
    ];

     protected static function boot()
    {
        parent::boot();

        static::creating(function ($applicant) {
            if (!isset($applicant->status)) {
                $applicant->status = 'pending';
            }
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function scholarship()
    {
        return $this->belongsTo(Scholarship::class);
    }
}
