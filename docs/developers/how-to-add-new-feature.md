# How to Add a New Feature

This guide walks you through the actionable steps required to add a new page or feature to the JANUS monolith, from the backend controller to the frontend React component. 

* **Audience:** Full-stack engineers (Laravel/React).
* **Goal:** Successfully implement a full-stack feature respecting the project's strict architectural protocols.

## Prerequisites

- Local environment running (`php artisan serve` and `bun dev`).
- Understanding of the monolith structure (Laravel 12 + Inertia.js + React 19.2).

## Step 1: Create the Route

Define your route in `routes/web.php`. Remember that JANUS enforces strict access control.
Decide if your route belongs to the `auth` middleware (requires login) or `guest` middleware.

```php
use App\Http\Controllers\Candidate\MyNewFeatureController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/my-new-feature', [MyNewFeatureController::class, 'index'])->name('candidate.new-feature');
});
```

## Step 2: Create the Controller

Create the controller to handle the request. According to the **Backend Standard**, controllers should only handle request validation, service calling, and returning the response. No business logic belongs here.

```bash
php artisan make:controller Candidate/MyNewFeatureController
```

**`app/Http/Controllers/Candidate/MyNewFeatureController.php`**

```php
<?php

declare(strict_types=1);

namespace App\Http\Controllers\Candidate;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MyNewFeatureController extends Controller
{
    /**
     * Display the new feature page.
     */
    public function index(Request $request): Response
    {
        // 1. Fetch data using Eloquent safely (e.g., eager loading)
        // 2. Pass data to Inertia
        
        return Inertia::render('Candidate/MyNewFeature', [
            'someProp' => 'Hello World',
        ]);
    }
}
```

> [!WARNING]
> **Controller Hygiene:** Never write raw SQL or complex logic here. If needed, create a Service class in `App\Services` and inject it through the constructor.

## Step 3: Create the React Component

Create a new React page component at `resources/js/pages/Candidate/MyNewFeature.tsx`.

Adhere to the **Frontend Standard**:
- **120-Line Rule:** If the file exceeds 120 lines, split it into smaller components.
- **Component Purity:** Keep logic in custom hooks if complex.

**`resources/js/pages/Candidate/MyNewFeature.tsx`**

```tsx
import { Head } from '@inertiajs/react';

interface Props {
    someProp: string;
}

export default function MyNewFeature({ someProp }: Props) {
    return (
        <>
            <Head title="My New Feature" />
            
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
                        New Feature
                    </h1>
                </header>
                
                <main>
                    <div className="overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-zinc-200">
                        <div className="p-6">
                            <p className="text-zinc-500">
                                Message from Controller: <span className="font-semibold text-purple-600">{someProp}</span>
                            </p>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
```

## Step 4: Verify UI Aesthetics

JANUS uses a "Minimalist Industrial" theme (Black/White/Purple). Ensure your new page follows this vibe:

1.  **Colors:** Rely on standard Tailwind Zinc colors (`zinc-900` for text, `zinc-50` for surfaces) and `purple-600` for primary accents.
2.  **Components:** Use `shadcn/ui` components from `resources/js/components/ui/` where possible before writing custom UI elements.

## Step 5: Test the Flow

1. Navigate to `/my-new-feature` in your browser.
2. Verify the page loads correctly through Inertia.
3. Check the developer console for any prop warnings or errors.
