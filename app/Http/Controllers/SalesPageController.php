<?php

namespace App\Http\Controllers;

use App\Actions\SalesPage\CreateSalesPageAction;
use App\DTOs\SalesPageData;
use App\Models\SalesPage;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SalesPageController extends Controller
{
    public function index()
    {
        return Inertia::render('Dashboard', [
            'salesPages' => SalesPage::where('user_id', auth()->id())->latest()->get()
        ]);
    }

    public function store(Request $request, CreateSalesPageAction $createAction)
    {
        $validated = $request->validate([
            'product_name' => 'required|string|max:255',
            'product_description' => 'required|string',
            'features' => 'required|array',
            'target_audience' => 'required|string',
            'price' => 'nullable|string',
            'usp' => 'nullable|string',
            'theme' => 'nullable|string',
            'tone' => 'nullable|string',
        ]);

        $dto = SalesPageData::fromRequest($validated);
        
        $salesPage = $createAction->handle($dto, auth()->id());

        return back()->with('success', 'Sales page generated successfully!');
    }

    public function show(SalesPage $salesPage)
    {
        if ($salesPage->user_id !== auth()->id()) {
            abort(403);
        }

        return Inertia::render('SalesPage/Preview', [
            'salesPage' => $salesPage
        ]);
    }

    public function destroy(SalesPage $salesPage)
    {
        if ($salesPage->user_id !== auth()->id()) {
            abort(403);
        }

        $salesPage->delete();

        return redirect()->route('dashboard')->with('success', 'Sales page deleted.');
    }

    public function regenerate(Request $request, SalesPage $salesPage, \App\Services\AI\AIServiceInterface $aiService)
    {
        if ($salesPage->user_id !== auth()->id()) {
            abort(403);
        }

        $section = $request->input('section');
        \Illuminate\Support\Facades\Log::info("Regenerate Request Received", ['section' => $section, 'page_id' => $salesPage->id]);
        
        $dto = SalesPageData::fromRequest($salesPage->input_data);

        $updatedCopy = $aiService->regenerateSection($dto, $section, $salesPage->generated_copy);

        $salesPage->update([
            'generated_copy' => $updatedCopy
        ]);

        return back()->with('success', ucfirst($section) . ' regenerated!');
    }

    public function updateTheme(Request $request, SalesPage $salesPage)
    {
        if ($salesPage->user_id !== auth()->id()) {
            abort(403);
        }

        $salesPage->update([
            'theme' => $request->input('theme')
        ]);

        return back()->with('success', 'Theme updated!');
    }

    public function updateCopy(Request $request, SalesPage $salesPage)
    {
        if ($salesPage->user_id !== auth()->id()) {
            abort(403);
        }

        $salesPage->update([
            'generated_copy' => $request->input('generated_copy')
        ]);

        return back()->with('success', 'Content updated!');
    }

    public function updateSettings(Request $request, SalesPage $salesPage)
    {
        if ($salesPage->user_id !== auth()->id()) {
            abort(403);
        }

        $salesPage->update([
            'settings' => $request->input('settings')
        ]);

        return back()->with('success', 'Settings updated!');
    }

    public function publicShow(string $uuid)
    {
        $salesPage = SalesPage::where('uuid', $uuid)->firstOrFail();
        
        $salesPage->increment('views_count');

        return Inertia::render('SalesPage/Public', [
            'salesPage' => $salesPage
        ]);
    }

    public function updateImageStyle(Request $request, SalesPage $salesPage)
    {
        if ($salesPage->user_id !== auth()->id()) abort(403);

        $salesPage->update([
            'image_style' => $request->input('image_style')
        ]);

        return back()->with('success', 'Image style updated!');
    }

    public function regenerateImage(Request $request, SalesPage $salesPage)
    {
        if ($salesPage->user_id !== auth()->id()) abort(403);

        $salesPage->update([
            'image_seed' => rand(1, 999999)
        ]);

        return back()->with('success', 'Image regenerated!');
    }

    public function magicRewrite(Request $request, SalesPage $salesPage, \App\Services\AI\AIServiceInterface $aiService)
    {
        if ($salesPage->user_id !== auth()->id()) abort(403);

        $text = $request->input('text');
        $action = $request->input('action');
        $section = $request->input('section');

        $rewrittenText = $aiService->magicRewrite($text, $action);

        $copy = $salesPage->generated_copy;
        
        // Use Laravel's data_set to handle dot notation (e.g. "benefits.0")
        data_set($copy, $section, $rewrittenText);

        $salesPage->update([
            'generated_copy' => $copy
        ]);

        return back()->with('success', 'Rewritten successfully!');
    }
}
