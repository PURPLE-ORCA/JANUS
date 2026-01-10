<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Company;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rules\File;
use Inertia\Inertia;
use Inertia\Response;

class CompanyController extends Controller
{
    /**
     * Display a listing of companies.
     */
    public function index(Request $request): Response
    {
        $query = Company::query();

        // Search filter
        if ($search = $request->get('search')) {
            $query->where('name', 'ilike', "%{$search}%");
        }

        // Sector filter
        if ($sector = $request->get('sector')) {
            $query->where('sector', $sector);
        }

        // Verified filter
        if ($request->has('is_verified')) {
            $query->where('is_verified', $request->boolean('is_verified'));
        }

        $companies = $query
            ->withCount('offers')
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('admin/companies/index', [
            'companies' => $companies,
            'filters' => [
                'search' => $request->get('search'),
                'sector' => $request->get('sector'),
                'is_verified' => $request->get('is_verified'),
            ],
        ]);
    }

    /**
     * Show the form for creating a new company.
     */
    public function create(): Response
    {
        return Inertia::render('admin/companies/create');
    }

    /**
     * Store a newly created company.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:companies,name'],
            'sector' => ['required', 'string', 'in:tech,finance,healthcare,retail,services,education,other'],
            'city' => ['required', 'string', 'max:100'],
            'website_url' => ['nullable', 'url', 'max:255'],
            'description' => ['nullable', 'string', 'max:2000'],
            'is_verified' => ['boolean'],
        ]);

        $company = Company::create($validated);

        return redirect()
            ->route('admin.companies.index')
            ->with('success', 'Entreprise créée avec succès.');
    }

    /**
     * Show the form for editing a company.
     */
    public function edit(Company $company): Response
    {
        return Inertia::render('admin/companies/edit', [
            'company' => $company,
        ]);
    }

    /**
     * Update the specified company.
     */
    public function update(Request $request, Company $company): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:companies,name,' . $company->id],
            'sector' => ['required', 'string', 'in:tech,finance,healthcare,retail,services,education,other'],
            'city' => ['required', 'string', 'max:100'],
            'website_url' => ['nullable', 'url', 'max:255'],
            'description' => ['nullable', 'string', 'max:2000'],
            'is_verified' => ['boolean'],
        ]);

        $company->update($validated);

        return redirect()
            ->route('admin.companies.index')
            ->with('success', 'Entreprise mise à jour.');
    }

    /**
     * Remove the specified company.
     */
    public function destroy(Company $company): RedirectResponse
    {
        // Check if company has offers
        if ($company->offers()->exists()) {
            return back()->with('error', 'Impossible de supprimer une entreprise ayant des offres.');
        }

        // Delete logo if exists
        if ($company->logo_path) {
            Storage::disk('public')->delete($company->logo_path);
        }

        $company->delete();

        return redirect()
            ->route('admin.companies.index')
            ->with('success', 'Entreprise supprimée.');
    }

    /**
     * Toggle company verification status.
     */
    public function toggleVerified(Company $company): RedirectResponse
    {
        $company->update(['is_verified' => !$company->is_verified]);

        $status = $company->is_verified ? 'vérifiée' : 'non vérifiée';

        return back()->with('success', "Entreprise marquée comme {$status}.");
    }

    /**
     * Upload company logo.
     */
    public function uploadLogo(Request $request, Company $company): RedirectResponse
    {
        $request->validate([
            'logo' => [
                'required',
                File::image()
                    ->max(2 * 1024), // 2MB max
            ],
        ]);

        // Delete old logo if exists
        if ($company->logo_path) {
            Storage::disk('public')->delete($company->logo_path);
        }

        // Store new logo
        $path = $request->file('logo')->store('logos', 'public');

        $company->update(['logo_path' => $path]);

        return back()->with('success', 'Logo mis à jour.');
    }
}
