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
        'login_id',  // student or employee number
        'password',
        'type',      // admin, student, student_org, faculty, org_advisor, dean
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

        public function applications()
    {
        return $this->hasMany(Applicant::class);
    }

    // === RELATIONSHIPS ===

    // public function student()
    // {
    //     return $this->hasOne(Student::class);
    // }

    // public function faculty()
    // {
    //     return $this->hasOne(Faculty::class);
    // }

    // public function admin()
    // {
    //     return $this->hasOne(Admin::class);
    // }

    // public function dean()
    // {
    //     return $this->hasOne(Dean::class);
    // }

    // public function studentOrg()
    // {
    //     return $this->hasOne(StudentOrg::class);
    // }

    // public function orgAdvisor()
    // {
    //     return $this->hasOne(OrgAdvisor::class);
    // }
}
