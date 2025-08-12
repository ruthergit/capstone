<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Scholarship extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'pdf_path', 'original_name'];

    public function applicants()
    {
        return $this->hasMany(Applicant::class);
    }
}
