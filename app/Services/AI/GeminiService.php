<?php

namespace App\Services\AI;

use App\DTOs\SalesPageData;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeminiService implements AIServiceInterface
{
    protected string $apiKey;

    public function __construct()
    {
        $this->apiKey = config('services.gemini.key') ?? 'MOCK_KEY';
    }

    protected function callGemini(string $prompt, bool $isJson = false): ?string
    {
        if ($this->apiKey === 'MOCK_KEY') return null;

        $models = [
            'gemini-2.5-flash',
            'gemini-2.0-flash',
            'gemini-1.5-flash',
            'gemini-pro-latest'
        ];

        foreach ($models as $model) {
            try {
                $url = "https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent?key={$this->apiKey}";
                Log::info("Trying Gemini Model: {$model}");
                
                $payload = [
                    'contents' => [['parts' => [['text' => $prompt]]]]
                ];

                if ($isJson) {
                    $payload['generationConfig'] = ['responseMimeType' => 'application/json'];
                }

                $response = Http::timeout(30)->post($url, $payload);

                if ($response->successful()) {
                    Log::info("Gemini Model Success: {$model}");
                    $result = $response->json();
                    return $result['candidates'][0]['content']['parts'][0]['text'] ?? null;
                } else {
                    Log::warning("Gemini Model Failed: {$model}", ['status' => $response->status(), 'body' => $response->body()]);
                }
            } catch (\Exception $e) {
                Log::error("Gemini Error with model {$model}: " . $e->getMessage());
                continue;
            }
        }

        return null;
    }

    public function generateSalesPage(SalesPageData $data): array
    {
        if ($this->apiKey === 'MOCK_KEY') return $this->getMockResponse($data);

        $prompt = $this->buildPrompt($data);
        $response = $this->callGemini($prompt, true);

        if (!$response) return $this->getMockResponse($data);

        return json_decode($response, true) ?: $this->getMockResponse($data);
    }

    public function regenerateSection(SalesPageData $data, string $section, array $currentCopy): array
    {
        if ($this->apiKey === 'MOCK_KEY') {
            $mock = $this->getMockResponse($data);
            $currentCopy[$section] = $mock[$section] ?? "Regenerated {$section}";
            return $currentCopy;
        }

        $prompt = $this->buildPrompt($data) . "\n\nCRITICAL: The user wants to REGENERATE only the '{$section}' section. Please provide a new, improved version of '{$section}' while keeping the context of the rest of the page. Return the FULL JSON with the updated '{$section}'.";
        
        $response = $this->callGemini($prompt, true);

        if (!$response) return $currentCopy;

        $newData = json_decode($response, true);
        return array_merge($currentCopy, $newData ?: []);
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
            "image_keyword": "3-5 descriptive keywords for a hero image",
            "faq": [
                {"question": "Common user question?", "answer": "Helpful answer."}
            ],
            "testimonials": [
                {"name": "Customer Name", "role": "CEO / Customer", "content": "Brief, powerful review."}
            ],
            "meta_title": "SEO Optimized Page Title",
            "meta_description": "Engaging meta description for social sharing"
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
            'image_keyword' => "business, professional, office",
            'faq' => [
                ['question' => "Is there a money-back guarantee?", 'answer' => "Yes, we offer a 30-day risk-free trial."]
            ],
            'testimonials' => [
                ['name' => "John Doe", 'role' => "Entrepreneur", 'content' => "This changed the way I do business!"]
            ],
            'meta_title' => "{$data->productName} - Official Sales Page",
            'meta_description' => "Discover how {$data->productName} can help you achieve more. High-converting solutions for {$data->targetAudience}."
        ];
    }

    public function magicRewrite(string $text, string $action): string
    {
        if ($this->apiKey === 'MOCK_KEY') return $this->getMockRewrite($text, $action);

        $prompt = "You are a master conversion copywriter. Rewrite the sales copy below to be {$action}.
        - Focus on results and benefits.
        - Ensure the tone is consistent with premium high-converting brands.
        - DO NOT output any quotes or labels. ONLY the rewritten text.
        
        Original Text: \"{$text}\"
        Rewritten Text:";

        $response = $this->callGemini($prompt);

        if (!$response) return $this->getMockRewrite($text, $action);

        return trim($response, " \"\n\r");
    }

    protected function getMockRewrite(string $text, string $action): string
    {
        return match($action) {
            'shorten' => (strlen($text) > 100 ? substr($text, 0, 100) : $text),
            'expand' => $text . " with additional professional details for better conversion.",
            'professional' => "Highly professional and polished: " . $text,
            'persuasive' => "Compelling and persuasive: " . $text,
            'witty' => "Smart and engaging: " . $text,
            'fix_grammar' => ucfirst(trim($text)),
            default => $text
        };
    }
}
