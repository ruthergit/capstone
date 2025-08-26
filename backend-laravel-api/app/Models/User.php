<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    protected $fillable = [
        'name',
        'email',
        'login_id',
        'password',
        'type',
        'org_advisor_id',
        'dean_id',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
        ];
    }

    // public function applications()
    // {
    //     return $this->hasMany(Applicant::class);
    // }

    // Relationship: For student_org → org_advisor
    public function orgAdvisor()
    {
        return $this->belongsTo(User::class, 'org_advisor_id');
    }

    // Relationship: For student_org and org_advisor → dean
    public function dean()
    {
        return $this->belongsTo(User::class, 'dean_id');
    }

    // Reverse: For org_advisor → many student_org
    public function studentOrgs()
    {
        return $this->hasMany(User::class, 'org_advisor_id')->where('type', 'student_org');
    }

    // Reverse: For dean → many org_advisors
    public function orgAdvisors()
    {
        return $this->hasMany(User::class, 'dean_id')->where('type', 'org_advisor');
    }

    public function createdEvents()
    {
        return $this->hasMany(Event::class, 'created_by');
    }
}

