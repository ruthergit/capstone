<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EventApproval extends Model
{
    use HasFactory;

    protected $fillable = [
        'event_id',
        'user_id',
        'role',
        'status',
        'remarks',
        'approved_at',
    ];

    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    public function approver()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
