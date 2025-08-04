<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'created_by',
        'org_advisor_id',
        'dean_id',
        'admin_id',
        'org_advisor_approved_at',
        'dean_approved_at',
        'admin_approved_at',
        'org_advisor_rejected_at',
        'dean_rejected_at',
        'admin_rejected_at',
        'rejection_reason',
        'status',
        'event_name',
        'short_description',
        'event_type',
        'location',
        'proposed_date',
        'optional_date',
        'letter_path',
    ];

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function orgAdvisor()
    {
        return $this->belongsTo(User::class, 'org_advisor_id');
    }

    public function dean()
    {
        return $this->belongsTo(User::class, 'dean_id');
    }

    public function admin()
    {
        return $this->belongsTo(User::class, 'admin_id');
    }
}
