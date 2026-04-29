<?php

namespace App\Services\AI;

use App\DTOs\SalesPageData;

interface AIServiceInterface
{
    /**
     * Generate sales page content based on provided data.
     * 
     * @param SalesPageData $data
     * @return array The structured AI response (Headline, Sub-headline, etc.)
     */
    public function generateSalesPage(SalesPageData $data): array;

    /**
     * Regenerate a specific section of the sales page.
     */
    public function regenerateSection(SalesPageData $data, string $section, array $currentCopy): array;

    /**
     * Rewrite a specific piece of text based on an action.
     */
    public function magicRewrite(string $text, string $action): string;
}
