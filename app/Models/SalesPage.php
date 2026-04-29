<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SalesPage extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'uuid',
        'product_name',
        'target_audience',
        'input_data',
        'generated_copy',
        'theme',
        'status',
        'views_count',
        'image_style',
        'image_seed',
        'settings',
    ];

    protected static function booted()
    {
        static::creating(function ($salesPage) {
            $salesPage->uuid = (string) \Illuminate\Support\Str::uuid();
            $salesPage->settings = [
                'cta_type' => 'whatsapp',
                'whatsapp_number' => '',
                'whatsapp_message' => 'Halo, saya tertarik dengan produk Anda!',
                'visible_sections' => [
                    'faq' => false,
                    'testimonials' => false,
                ]
            ];
        });
    }

    protected $casts = [
        'input_data' => 'array',
        'generated_copy' => 'array',
        'settings' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
