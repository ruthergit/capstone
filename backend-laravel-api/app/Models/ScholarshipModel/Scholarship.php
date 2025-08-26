<?php

namespace App\Models\ScholarshipModel;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Scholarship extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'pdf_path', 'original_name'];

    public function scholarshipApplicants() 
    {
        return $this->hasMany(ScholarshipApplicant::class); 
    }
    protected $appends = ['pdf_url']; // Add this so it shows in JSON

    public function getPdfUrlAttribute()
    {
        $filename = basename($this->pdf_path);
        return url("preview-pdf/scholarships/" . $filename);
    }
}
