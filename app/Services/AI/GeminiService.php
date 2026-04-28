<?php

namespace App\Services\AI;

use App\DTOs\SalesPageData;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeminiService implements AIServiceInterface
{
    protected string $apiKey;
    protected string $baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

    public function __construct()
    {
        $this->apiKey = config('services.gemini.key') ?? 'MOCK_KEY';
    }

    public function generateSalesPage(SalesPageData $data): array
    {
        // If no API key, return mock data for development
        if ($this->apiKey === 'MOCK_KEY') {
            return $this->getMockResponse($data);
        }

        try {
            $prompt = $this->buildPrompt($data);

            $response = Http::post("{$this->baseUrl}?key={$this->apiKey}", [
                'contents' => [
                    [
                        'parts' => [
                            ['text' => $prompt]
                        ]
                    ]
                ],
                'generationConfig' => [
                    'responseMimeType' => 'application/json',
                ]
            ]);

            if ($response->failed()) {
                Log::error('Gemini API Error: ' . $response->body());
                return $this->getMockResponse($data); // Fallback to mock
            }

            $result = $response->json();
            $textResponse = $result['candidates'][0]['content']['parts'][0]['text'] ?? '{}';
            
            return json_decode($textResponse, true);

        } catch (\Exception $e) {
            Log::error('Gemini Service Exception: ' . $e->getMessage());
            return $this->getMockResponse($data);
        }
    }

    public function regenerateSection(SalesPageData $data, string $section, array $currentCopy): array
    {
        if ($this->apiKey === 'MOCK_KEY') {
            $mock = $this->getMockResponse($data);
            $currentCopy[$section] = $mock[$section] ?? "Regenerated {$section}";
            return $currentCopy;
        }

        try {
            $prompt = $this->buildPrompt($data) . "\n\nCRITICAL: The user wants to REGENERATE only the '{$section}' section. Please provide a new, improved version of '{$section}' while keeping the context of the rest of the page. Return the FULL JSON with the updated '{$section}'.";

            $response = Http::post("{$this->baseUrl}?key={$this->apiKey}", [
                'contents' => [['parts' => [['text' => $prompt]]]],
                'generationConfig' => ['responseMimeType' => 'application/json']
            ]);

            if ($response->failed()) return $currentCopy;

            $result = $response->json();
            $textResponse = $result['candidates'][0]['content']['parts'][0]['text'] ?? '{}';
            
            return json_decode($textResponse, true);

        } catch (\Exception $e) {
            return $currentCopy;
        }
    }

    protected function buildPrompt(SalesPageData $data): string
    {
        $features = implode(', ', $data->features);
        
        return <<<PROMPT
        You are a professional conversion copywriter. Generate a structured sales page in JSON format for the following product:
        Product Name: {$data->productName}
        Description: {$data->productDescription}
        Features: {$features}
        Target Audience: {$data->targetAudience}
        Price: {$data->price}
        USP: {$data->uniqueSellingPoints}
        Writing Tone: {$data->tone}
        
        IMPORTANT: Use a {$data->tone} tone throughout the copy. Make it highly engaging for the target audience.
        
        The JSON should strictly follow this structure:
        {
            "headline": "Compelling headline",
            "subheadline": "Engaging sub-headline",
            "problem": "Identify the user's problem",
            "solution": "How this product solves it",
            "benefits": ["Benefit 1", "Benefit 2", "Benefit 3"],
            "features_breakdown": [
                {"title": "Feature Title", "description": "Feature description"}
            ],
            "social_proof_placeholder": "A placeholder testimonial or social proof text",
            "pricing_display": "Clear pricing information",
            "cta": "Strong Call to Action text",
            "image_keyword": "3-5 descriptive keywords for a hero image (e.g., 'modern tech office' or 'fresh coffee beans')"
        }
        Return ONLY the JSON.
        PROMPT;
    }

    protected function getMockResponse(SalesPageData $data): array
    {
        return [
            'headline' => "Transform Your Life with {$data->productName}",
            'subheadline' => "The ultimate solution designed specifically for {$data->targetAudience}.",
            'problem' => "Stop struggling with inefficient methods and start seeing real results.",
            'solution' => "Our product leverages advanced technology to simplify your workflow.",
            'benefits' => [
                "Increase productivity by 50%",
                "Save hours of manual work every week",
                "Professional results without the steep learning curve"
            ],
            'features_breakdown' => array_map(function($f) {
                return ['title' => $f, 'description' => "Detailed breakdown of how {$f} helps you achieve more."];
            }, array_slice($data->features, 0, 3)),
            'social_proof_placeholder' => "Join over 10,000+ happy customers who have switched to {$data->productName}.",
            'pricing_display' => $data->price ?? "Starting from $19/month",
            'cta' => "Get Started Now",
            'image_keyword' => "business, professional, office"
        ];
    }
}
