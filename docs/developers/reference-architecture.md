# Reference: Architecture Standards

This reference document outlines the strict architectural rules, design philosophies, and protocols that govern the JANUS codebase. It serves as a dictionary of our technical constraints.

* **Audience:** Full-stack engineers (Laravel/React).
* **Goal:** Provide a quick lookup for codebase rules to ensure all merge requests meet production standards.

## 1. Operational Directives (Default Mode)

*   **Zero Tolerance for Bloat:** If a feature or logic block can be written in 5 lines, do not write 10.
*   **Strict Typing (PHP):** Every PHP file MUST begin with `declare(strict_types=1);`.
*   **Safety First:** Always assume all incoming HTTP requests and inputs are malicious. Rely on Laravel FormRequests for strict validation.

## 2. Frontend Standards (React)

JANUS uses **React 19.2+**, **Inertia.js**, and **Tailwind CSS (v4)**.

*   **The 120-Line Rule:** React components exceeding 120 lines are BANNED. Split large files into smaller, focused sub-components.
*   **Component Purity:** UI components must be "dumb" (presentation only). Complex state or data fetching logic belongs in Custom Hooks (e.g., `useCandidateFilters`).
*   **No PHP in JS:** Never inject Blade variables directly into JavaScript. Pass data strictly via React Props from Inertia Controllers.
*   **Aesthetics (Minimalist Industrial):** 
    *   Strictly use the established color palette (Zinc backgrounds, White/Black contrast, Purple (`#5617c2`) accents).
    *   Favor reusable `shadcn/ui` components.

## 3. Backend Standards (Laravel)

JANUS is built on **Laravel 12 (Monolith/Inertia)** running on **PostgreSQL**. The deployment target is shared hosting, meaning we avoid complex microservices or separate frontend deployments.

### Architecture & Coupling

*   **Dependency Injection (IoC) ONLY:** 
    *   **FORBIDDEN:** Instantiating classes directly within controllers (e.g., `$user = new User();`). This creates tight coupling.
    *   **REQUIRED:** Always inject classes via the Constructor or method signature, allowing the Laravel Service Container to resolve them.
*   **Controller Hygiene:** 
    *   Controllers are responsible for three things *only*: Request validation, calling a Service, and returning a Response.
    *   Zero business logic is permitted in controllers. Move logic to dedicated Service classes (e.g., `App\Services\ApplicationProcessingService`).

### Eloquent & Performance

*   **Memory Safety:** 
    *   **FORBIDDEN:** Using `User::all()` or `->get()` on tables that grow continuously (Logs, Applications, Candidates).
    *   **REQUIRED:** Use `->chunk()`, `->lazy()`, or `->cursor()` to process large datasets in memory-safe batches.
*   **Convention Over Configuration:** 
    *   Adhere strictly to standard Laravel naming conventions (Tables: plural `candidates`, Models: singular `Candidate`). Avoid manually defining `$table` or `$primaryKey` properties.

### Syntactic Sugar & Modern PHP

Write less, do more by leveraging Laravel's global helpers and PHP 8+ features.

*   **Use Helpers:**
    *   `session('key')` instead of `Session::get('key')`
    *   `request('name')` instead of `$request->input('name')`
    *   `back()` instead of `Redirect::back()`
*   **Eloquent Shortcuts:**
    *   `latest()` instead of `orderBy('created_at', 'desc')`
*   **PHP 8+ Features:**
    *   Use the Null-Safe Operator (`?->`) to prevent crashes on null objects (e.g., `$user->profile?->id`).
    *   Use Named Arguments for clarity in complex function calls.
