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
}
