<?php

namespace App\Models\AssistantshipModel;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\User;
use Illuminate\Notifications\Notifiable;

class AssistantshipApplicant extends Model
{
    use HasFactory, Notifiable;

    protected $table = 'assistantship_applicants'; 

    protected $fillable = [
        'user_id',
        'assistantship_id', 
        'submitted_at',
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

    public function assistantship()
    {
        return $this->belongsTo(Assistantship::class);
    }

    public function files()
    {
        return $this->hasMany(AssistantshipApplicantFile::class);
    }
}
