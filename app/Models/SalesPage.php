<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SalesPage extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'product_name',
        'target_audience',
        'input_data',
        'generated_copy',
        'theme',
        'status',
    ];

    protected $casts = [
        'input_data' => 'array',
        'generated_copy' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
