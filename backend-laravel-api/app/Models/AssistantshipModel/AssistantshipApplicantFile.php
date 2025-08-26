<?php

namespace App\Models\AssistantshipModel;

use Illuminate\Database\Eloquent\Model;

class AssistantshipApplicantFile extends Model
{

    protected $table = 'assistantship_applicant_files';
    protected $fillable = [
        'assistantship_applicant_id',
        'file_path',
        'original_name',
        'file_type',
        'file_size',
    ];

    public function applicant()
    {
        return $this->belongsTo(AssistantshipApplicant::class);
    }
}
