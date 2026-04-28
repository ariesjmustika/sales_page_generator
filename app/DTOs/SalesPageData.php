<?php

namespace App\DTOs;

readonly class SalesPageData
{
    public function __construct(
        public string $productName,
        public string $productDescription,
        public array $features,
        public string $targetAudience,
        public ?string $price = null,
        public ?string $uniqueSellingPoints = null,
        public string $theme = 'modern',
        public ?string $tone = 'professional'
    ) {}

    public static function fromRequest(array $data): self
    {
        return new self(
            productName: $data['product_name'],
            productDescription: $data['product_description'],
            features: is_array($data['features']) ? $data['features'] : explode(',', $data['features']),
            targetAudience: $data['target_audience'],
            price: $data['price'] ?? null,
            uniqueSellingPoints: $data['usp'] ?? null,
            theme: $data['theme'] ?? 'modern',
            tone: $data['tone'] ?? 'professional'
        );
    }

    public function toArray(): array
    {
        return [
            'product_name' => $this->productName,
            'description' => $this->productDescription,
            'features' => $this->features,
            'target_audience' => $this->targetAudience,
            'price' => $this->price,
            'usp' => $this->uniqueSellingPoints,
            'theme' => $this->theme,
            'tone' => $this->tone,
        ];
    }
}
