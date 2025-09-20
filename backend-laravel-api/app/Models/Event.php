<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_org_id',
        'name',
        'short_description',
        'type',
        'location',
        'proposed_date',
        'optional_date',
        'status',
        'final_date',
    ];

    public function studentOrg()
    {
        return $this->belongsTo(User::class, 'student_org_id');
    }

    public function approvals()
    {
        return $this->hasMany(EventApproval::class);
    }

    public function files()
    {
        return $this->hasMany(EventFile::class);
    }
}
