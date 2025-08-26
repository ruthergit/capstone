<?php

namespace App\Models\AssistantshipModel;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Assistantship extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'description', 'pdf_path', 'original_name'];

    public function applicants()
    {
        return $this->hasMany(AssistantshipApplicant::class);
    }
    
    protected $appends = ['pdf_url']; // 👈 include this field in JSON

    public function getPdfUrlAttribute()
    {
        $filename = basename($this->pdf_path);// or however you store the file
        return url("preview-pdf/assistantships/" . $filename);
    }
}
