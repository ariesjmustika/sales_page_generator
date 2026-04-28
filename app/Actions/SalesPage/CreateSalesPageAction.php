<?php

namespace App\Actions\SalesPage;

use App\DTOs\SalesPageData;
use App\Models\SalesPage;
use App\Services\AI\AIServiceInterface;
use Illuminate\Support\Facades\DB;

class CreateSalesPageAction
{
    public function __construct(
        protected AIServiceInterface $aiService
    ) {}

    public function handle(SalesPageData $data, int $userId): SalesPage
    {
        return DB::transaction(function () use ($data, $userId) {
            // 1. Generate content via AI
            $generatedCopy = $this->aiService->generateSalesPage($data);

            // 2. Create and save the model
            $salesPage = new SalesPage();
            $salesPage->user_id = $userId;
            $salesPage->product_name = $data->productName;
            $salesPage->target_audience = $data->targetAudience;
            $salesPage->input_data = $data->toArray();
            $salesPage->generated_copy = $generatedCopy;
            $salesPage->theme = $data->theme;
            $salesPage->status = 'generated';
            $salesPage->save();

            return $salesPage;
        });
    }
}
