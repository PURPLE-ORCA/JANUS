# JANUS Backend Implementation Plan

> **Version**: 0.3.0 — Backend Integration  
> **Created**: January 10, 2026  
> **Status**: APPROVED

---

## Executive Summary

This document outlines the phased approach to implement the backend for JANUS, connecting the fully-built React frontend to Laravel 12 controllers, services, and real database data. The frontend currently uses mock JSON hooks (`use-mock-data.ts`) that will be replaced with Inertia.js props.

### Current State Analysis

| Component         | Status      | Notes                                     |
| ----------------- | ----------- | ----------------------------------------- |
| **Models**        | ✅ Complete | 10 Eloquent models with relationships     |
| **Migrations**    | ✅ Complete | 13 migrations for full schema             |
| **Factories**     | ⚠️ Partial  | Only `UserFactory` exists                 |
| **Seeders**       | ⚠️ Basic    | Single seeder creates 1 test user         |
| **Controllers**   | ❌ Missing  | Only Settings controllers exist           |
| **Services**      | ❌ Missing  | No business logic layer                   |
| **Form Requests** | ❌ Missing  | Only 2 settings requests exist            |
| **Middleware**    | ⚠️ Partial  | `EnsureUserIsActive` needs creation       |
| **Routes**        | ⚠️ Inline   | All routes use closures, need controllers |

---

## Phase 1: Foundation

> **Goal**: Create factories, seeders, and essential middleware

### 1.1 Factories

Create factories for all models to enable realistic test data generation.

| Factory                        | Priority | Fields                                                |
| ------------------------------ | -------- | ----------------------------------------------------- |
| `CompanyFactory`               | High     | name, sector, city, is_verified, description          |
| `ProfileFactory`               | High     | headline, skills, city, education_level, availability |
| `ProfileEducationFactory`      | Medium   | institution, degree, field, dates                     |
| `ProfileExperienceFactory`     | Medium   | company, title, description, dates                    |
| `ProfileLanguageFactory`       | Medium   | language, proficiency                                 |
| `OfferFactory`                 | High     | title, description, work_mode, experience_level       |
| `OfferScreenerQuestionFactory` | Low      | question, type, is_required                           |
| `ApplicationFactory`           | High     | status, cover_note, screener_responses                |
| `ApplicationNoteFactory`       | Low      | note content                                          |

#### [NEW] `database/factories/CompanyFactory.php`

```php
// Moroccan cities, realistic sectors, verified status
```

#### [NEW] `database/factories/ProfileFactory.php`

```php
// Skills array, Bac+X levels, availability enums
```

#### [NEW] `database/factories/OfferFactory.php`

```php
// Slugs, work_mode, experience_level, benefits array
```

_(Similar pattern for remaining factories)_

---

### 1.2 Seeders

Create domain-specific seeders that can be run independently or together.

| Seeder              | Records | Dependencies  |
| ------------------- | ------- | ------------- |
| `CompanySeeder`     | 10-15   | None          |
| `UserSeeder`        | 20-30   | None          |
| `ProfileSeeder`     | 20-30   | Users         |
| `OfferSeeder`       | 15-25   | Companies     |
| `ApplicationSeeder` | 50-100  | Users, Offers |

#### [NEW] `database/seeders/CompanySeeder.php`

Seed 10-15 Moroccan companies across different sectors (tech, finance, healthcare, etc.)

#### [NEW] `database/seeders/UserSeeder.php`

Seed users with different roles and statuses:

- 3 admin users (1 active, 1 pending, 1 for testing)
- 25+ candidate users with varied statuses

#### [NEW] `database/seeders/ProfileSeeder.php`

Create profiles with:

- Education entries (1-3 per profile)
- Experience entries (0-5 per profile)
- Language proficiencies (2-4 per profile)

#### [NEW] `database/seeders/OfferSeeder.php`

Create job offers with:

- Mix of work modes (onsite, remote, hybrid)
- Various experience levels
- Screener questions (0-5 per offer)

#### [NEW] `database/seeders/ApplicationSeeder.php`

Create applications with realistic status distribution:

- 40% new/viewed
- 30% shortlisted/interview
- 20% rejected
- 10% offered/hired

#### [MODIFY] `database/seeders/DatabaseSeeder.php`

Orchestrate all seeders in correct order:

```php
$this->call([
    CompanySeeder::class,
    UserSeeder::class,
    ProfileSeeder::class,
    OfferSeeder::class,
    ApplicationSeeder::class,
]);
```

---

### 1.3 Middleware

#### [NEW] `app/Http/Middleware/EnsureUserIsActive.php`

Block routes for users with `status !== 'active'`. Redirect to `/approval-pending`.

```php
public function handle(Request $request, Closure $next): Response
{
    if ($request->user()?->status !== 'active') {
        return redirect()->route('approval.pending');
    }
    return $next($request);
}
```

#### [NEW] `app/Http/Middleware/EnsureUserIsAdmin.php`

Restrict admin routes to users with `role === 'admin'`.

---

## Phase 2: Controllers — Public

> **Goal**: Replace inline route closures with proper controllers for public pages

### 2.1 Welcome/Home Controller

#### [NEW] `app/Http/Controllers/WelcomeController.php`

```php
public function __invoke(): Response
{
    return Inertia::render('welcome', [
        'featuredOffers' => Offer::active()
            ->with('company')
            ->latest()
            ->take(6)
            ->get(),
        'stats' => [
            'totalOffers' => Offer::active()->count(),
            'totalCompanies' => Company::verified()->count(),
        ],
        'canRegister' => Features::enabled(Features::registration()),
    ]);
}
```

---

### 2.2 Offers Controller

#### [NEW] `app/Http/Controllers/OfferController.php`

| Method    | Route                | Description              |
| --------- | -------------------- | ------------------------ |
| `index()` | `GET /offers`        | List offers with filters |
| `show()`  | `GET /offers/{slug}` | Single offer details     |

**Index method features:**

- Pagination (12 per page)
- Search by title/description
- Filter by type, location, work_mode, experience_level
- Filter by urgent/active status
- Eager load company relationship

**Show method features:**

- Find by slug
- Increment views_count
- Load company, screener_questions
- Check if current user has applied

---

## Phase 3: Controllers — Candidate Portal

> **Goal**: Build candidate dashboard, profile, and applications controllers

### 3.1 Dashboard Controller

#### [NEW] `app/Http/Controllers/Candidate/DashboardController.php`

Return stats and recent data for logged-in candidate:

```php
return Inertia::render('dashboard', [
    'stats' => [
        'totalApplications' => $user->applications()->count(),
        'shortlisted' => $user->applications()->where('status', 'shortlisted')->count(),
        'interviews' => $user->applications()->where('status', 'interview')->count(),
        'offered' => $user->applications()->where('status', 'offered')->count(),
    ],
    'recentApplications' => $user->applications()
        ->with(['offer.company'])
        ->latest()
        ->take(5)
        ->get(),
    'upcomingInterviews' => $user->applications()
        ->where('status', 'interview')
        ->whereNotNull('interview_at')
        ->where('interview_at', '>', now())
        ->with(['offer.company'])
        ->orderBy('interview_at')
        ->get(),
    'profileStrength' => $this->calculateProfileStrength($user->profile),
]);
```

---

### 3.2 Profile Controller

#### [NEW] `app/Http/Controllers/Candidate/ProfileController.php`

| Method           | Route                              | Description       |
| ---------------- | ---------------------------------- | ----------------- |
| `edit()`         | `GET /candidate-profile`           | Show profile form |
| `update()`       | `PUT /candidate-profile`           | Update profile    |
| `uploadResume()` | `POST /candidate-profile/resume`   | Upload resume PDF |
| `deleteResume()` | `DELETE /candidate-profile/resume` | Remove resume     |

#### [NEW] `app/Http/Requests/UpdateProfileRequest.php`

Validation rules for profile fields including Morocco-specific validations.

---

### 3.3 Applications Controller

#### [NEW] `app/Http/Controllers/Candidate/ApplicationController.php`

| Method       | Route                              | Description              |
| ------------ | ---------------------------------- | ------------------------ |
| `index()`    | `GET /my-applications`             | List user's applications |
| `store()`    | `POST /applications`               | Submit new application   |
| `withdraw()` | `POST /applications/{id}/withdraw` | Withdraw application     |

#### [NEW] `app/Http/Requests/StoreApplicationRequest.php`

Validate:

- User hasn't already applied to this offer
- User has a complete profile (resume uploaded)
- Screener responses match required questions

---

## Phase 4: Controllers — Admin Dashboard

> **Goal**: Full CRUD for admin management of users, offers, applications, and companies

### 4.1 Admin Dashboard Controller

#### [NEW] `app/Http/Controllers/Admin/DashboardController.php`

Return comprehensive admin stats:

```php
return Inertia::render('admin/index', [
    'stats' => [
        'totalUsers' => User::where('role', 'candidate')->count(),
        'pendingApprovals' => User::where('status', 'pending')->count(),
        'activeOffers' => Offer::active()->count(),
        'totalApplications' => Application::count(),
        'newApplications' => Application::where('status', 'new')->count(),
        'totalCompanies' => Company::count(),
        'verifiedCompanies' => Company::verified()->count(),
        'urgentOffers' => Offer::active()->urgent()->count(),
        'interviewsScheduled' => Application::where('status', 'interview')->count(),
    ],
    'recentApplications' => Application::with(['user', 'offer.company'])
        ->latest()
        ->take(10)
        ->get(),
    'pendingUsers' => User::where('status', 'pending')
        ->latest()
        ->take(5)
        ->get(),
]);
```

---

### 4.2 Admin User Controller

#### [NEW] `app/Http/Controllers/Admin/UserController.php`

| Method          | Route                            | Description               |
| --------------- | -------------------------------- | ------------------------- |
| `index()`       | `GET /admin/users`               | List users with filters   |
| `show()`        | `GET /admin/users/{id}`          | User details with profile |
| `approve()`     | `POST /admin/users/{id}/approve` | Set status to active      |
| `reject()`      | `POST /admin/users/{id}/reject`  | Set status to rejected    |
| `bulkApprove()` | `POST /admin/users/bulk-approve` | Approve multiple users    |
| `bulkReject()`  | `POST /admin/users/bulk-reject`  | Reject multiple users     |

---

### 4.3 Admin Offer Controller

#### [NEW] `app/Http/Controllers/Admin/OfferController.php`

| Method           | Route                              | Description          |
| ---------------- | ---------------------------------- | -------------------- |
| `index()`        | `GET /admin/offers`                | List all offers      |
| `create()`       | `GET /admin/offers/create`         | Show create form     |
| `store()`        | `POST /admin/offers`               | Create new offer     |
| `edit()`         | `GET /admin/offers/{slug}/edit`    | Show edit form       |
| `update()`       | `PUT /admin/offers/{slug}`         | Update offer         |
| `destroy()`      | `DELETE /admin/offers/{slug}`      | Delete offer         |
| `toggleActive()` | `POST /admin/offers/{slug}/toggle` | Toggle active status |

#### [NEW] `app/Http/Requests/StoreOfferRequest.php`

Validate all offer fields including JSON arrays for benefits and languages.

#### [NEW] `app/Http/Requests/UpdateOfferRequest.php`

Similar to store but with slug uniqueness exception.

---

### 4.4 Admin Application Controller

#### [NEW] `app/Http/Controllers/Admin/ApplicationController.php`

| Method                | Route                                     | Description           |
| --------------------- | ----------------------------------------- | --------------------- |
| `index()`             | `GET /admin/applications`                 | List all applications |
| `show()`              | `GET /admin/applications/{id}`            | Application details   |
| `updateStatus()`      | `PATCH /admin/applications/{id}/status`   | Change status         |
| `scheduleInterview()` | `POST /admin/applications/{id}/interview` | Set interview date    |
| `addNote()`           | `POST /admin/applications/{id}/notes`     | Add recruiter note    |
| `bulkUpdateStatus()`  | `POST /admin/applications/bulk-status`    | Bulk status change    |

---

### 4.5 Admin Company Controller

#### [NEW] `app/Http/Controllers/Admin/CompanyController.php`

| Method             | Route                               | Description           |
| ------------------ | ----------------------------------- | --------------------- |
| `index()`          | `GET /admin/companies`              | List companies        |
| `create()`         | `GET /admin/companies/create`       | Create form           |
| `store()`          | `POST /admin/companies`             | Store company         |
| `edit()`           | `GET /admin/companies/{id}/edit`    | Edit form             |
| `update()`         | `PUT /admin/companies/{id}`         | Update company        |
| `destroy()`        | `DELETE /admin/companies/{id}`      | Delete (if no offers) |
| `toggleVerified()` | `POST /admin/companies/{id}/verify` | Toggle verification   |
| `uploadLogo()`     | `POST /admin/companies/{id}/logo`   | Upload company logo   |

---

## Phase 5: Services Layer

> **Goal**: Extract business logic from controllers into reusable services

### 5.1 Application Services

#### [NEW] `app/Services/ApplicationService.php`

Handle application business logic:

- Check if user can apply (active status, profile complete)
- Process screener question responses
- Handle status transitions with validation
- Send notifications on status changes

#### [NEW] `app/Services/ProfileStrengthService.php`

Calculate profile completion percentage:

- Basic info (20%): headline, phone, city
- Resume (30%): resume_path uploaded
- Education (15%): at least one education entry
- Experience (20%): at least one experience entry
- Languages (15%): at least two languages

---

### 5.2 User Services

#### [NEW] `app/Services/UserApprovalService.php`

Handle user approval workflow:

- Validate user can be approved
- Update status
- Send welcome email notification
- Create activity log entry

---

### 5.3 Offer Services

#### [NEW] `app/Services/OfferService.php`

Handle offer operations:

- Generate unique slugs
- Validate screener questions
- Handle offer expiration (via scheduled command)

---

## Phase 6: Routes Refactoring

> **Goal**: Replace all inline route closures with controller methods

### [MODIFY] `routes/web.php`

**Before (current inline closures):**

```php
Route::get('/offers', function () {
    return Inertia::render('offers/index');
});
```

**After (controller-based):**

```php
// Public Routes
Route::get('/', WelcomeController::class)->name('home');
Route::get('/offers', [OfferController::class, 'index'])->name('offers.index');
Route::get('/offers/{slug}', [OfferController::class, 'show'])->name('offers.show');

// Approval Pending (accessible to unapproved users)
Route::get('/approval-pending', ApprovalPendingController::class)
    ->middleware('auth')
    ->name('approval.pending');

// Authenticated + Active User Routes
Route::middleware(['auth', 'verified', 'active'])->group(function () {
    // Candidate Routes
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/candidate-profile', [ProfileController::class, 'edit'])->name('candidate-profile');
    Route::put('/candidate-profile', [ProfileController::class, 'update']);
    Route::post('/candidate-profile/resume', [ProfileController::class, 'uploadResume']);
    Route::delete('/candidate-profile/resume', [ProfileController::class, 'deleteResume']);

    // Applications
    Route::get('/my-applications', [ApplicationController::class, 'index'])->name('applications.index');
    Route::post('/applications', [ApplicationController::class, 'store'])->name('applications.store');
    Route::post('/applications/{application}/withdraw', [ApplicationController::class, 'withdraw']);
});

// Admin Routes
Route::middleware(['auth', 'verified', 'active', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [Admin\DashboardController::class, 'index'])->name('dashboard');

    // Users
    Route::get('/users', [Admin\UserController::class, 'index'])->name('users.index');
    Route::get('/users/{user}', [Admin\UserController::class, 'show'])->name('users.show');
    Route::post('/users/{user}/approve', [Admin\UserController::class, 'approve']);
    Route::post('/users/{user}/reject', [Admin\UserController::class, 'reject']);
    Route::post('/users/bulk-approve', [Admin\UserController::class, 'bulkApprove']);
    Route::post('/users/bulk-reject', [Admin\UserController::class, 'bulkReject']);

    // Offers
    Route::resource('offers', Admin\OfferController::class)->except(['show']);
    Route::post('/offers/{slug}/toggle', [Admin\OfferController::class, 'toggleActive']);

    // Applications
    Route::get('/applications', [Admin\ApplicationController::class, 'index'])->name('applications.index');
    Route::get('/applications/{application}', [Admin\ApplicationController::class, 'show']);
    Route::patch('/applications/{application}/status', [Admin\ApplicationController::class, 'updateStatus']);
    Route::post('/applications/{application}/interview', [Admin\ApplicationController::class, 'scheduleInterview']);
    Route::post('/applications/{application}/notes', [Admin\ApplicationController::class, 'addNote']);
    Route::post('/applications/bulk-status', [Admin\ApplicationController::class, 'bulkUpdateStatus']);

    // Companies
    Route::resource('companies', Admin\CompanyController::class);
    Route::post('/companies/{company}/verify', [Admin\CompanyController::class, 'toggleVerified']);
    Route::post('/companies/{company}/logo', [Admin\CompanyController::class, 'uploadLogo']);
});
```

---

## Phase 7: Frontend Integration

> **Goal**: Replace mock data hooks with Inertia `usePage().props`

### 7.1 Remove Mock Data Dependencies

#### [DELETE] `resources/js/data/*.json`

Remove all mock JSON files after transition.

#### [MODIFY] `resources/js/hooks/use-mock-data.ts` → `use-data.ts`

Transform mock hooks into Inertia-aware hooks:

```typescript
// Before (mock)
export function useOffers(filters?: OfferFilters) {
    const offers = offersData as Offer[];
    // ... filtering logic
}

// After (real data from Inertia props)
export function useOffers() {
    const { offers, filters, pagination } = usePage<{
        offers: Offer[];
        filters: OfferFilters;
        pagination: Pagination;
    }>().props;

    return { offers, filters, pagination };
}
```

---

### 7.2 Update Page Components

Update all pages to receive data from `usePage().props` instead of mock hooks.

| Page                           | Props Needed                                                           |
| ------------------------------ | ---------------------------------------------------------------------- |
| `welcome.tsx`                  | `featuredOffers`, `stats`, `canRegister`                               |
| `offers/index.tsx`             | `offers`, `filters`, `pagination`                                      |
| `offers/show.tsx`              | `offer`, `hasApplied`, `canApply`                                      |
| `dashboard.tsx`                | `stats`, `recentApplications`, `upcomingInterviews`, `profileStrength` |
| `applications/index.tsx`       | `applications`, `stats`                                                |
| `profile/edit.tsx`             | `profile`, `strength`                                                  |
| `admin/index.tsx`              | `stats`, `recentApplications`, `pendingUsers`                          |
| `admin/users/index.tsx`        | `users`, `filters`, `pagination`                                       |
| `admin/offers/index.tsx`       | `offers`, `companies`, `filters`, `pagination`                         |
| `admin/applications/index.tsx` | `applications`, `filters`, `stats`                                     |
| `admin/companies/index.tsx`    | `companies`, `filters`, `pagination`                                   |
| `admin/companies/create.tsx`   | None (new company form)                                                |
| `admin/companies/edit.tsx`     | `company`                                                              |

---

### 7.3 Admin Company Management Pages (NEW)

> **Goal**: Create full CRUD pages for company management

#### [NEW] `resources/js/pages/admin/companies/index.tsx`

Company listing page with:

- Data table with columns: logo, name, sector, city, verified status, offers count
- Filters: sector, verified status, search by name
- Quick actions: verify/unverify, edit, delete
- Pagination

#### [NEW] `resources/js/pages/admin/companies/create.tsx`

Company creation form with:

- Company name, sector dropdown
- City, website URL
- Logo upload
- Description (textarea)
- Verified checkbox

#### [NEW] `resources/js/pages/admin/companies/edit.tsx`

Company edit form (same fields as create).

#### [MODIFY] `resources/js/pages/admin/index.tsx`

Add "Manage Companies" quick action card (currently disabled).

---

## Phase 8: Validation & Testing

> **Goal**: Ensure all functionality works correctly

### 8.1 Form Request Validation

Create comprehensive Form Requests for all write operations:

- `StoreApplicationRequest`
- `UpdateProfileRequest`
- `StoreOfferRequest` / `UpdateOfferRequest`
- `StoreCompanyRequest` / `UpdateCompanyRequest`
- `UpdateApplicationStatusRequest`
- `ScheduleInterviewRequest`
- `StoreApplicationNoteRequest`

---

### 8.2 Feature Tests

Update and expand existing tests to cover new controllers.

| Test File                         | Coverage                      |
| --------------------------------- | ----------------------------- |
| `OfferControllerTest`             | List, show, filters           |
| `ApplicationControllerTest`       | Store, withdraw, validation   |
| `ProfileControllerTest`           | Update, resume upload         |
| `Admin/UserControllerTest`        | Approve, reject, bulk actions |
| `Admin/OfferControllerTest`       | CRUD operations               |
| `Admin/ApplicationControllerTest` | Status updates, notes         |

---

## DEFERRED: Email Notifications

> **Status**: To be implemented in a future release
> **Reason**: User requested deferral — email is one of the last features

### Planned Notification Classes (Future)

- `UserApproved.php` — Sent when admin approves a user
- `UserRejected.php` — Sent when admin rejects a user
- `NewApplication.php` — Sent to admin on new application
- `ApplicationStatusChanged.php` — Sent to candidate on status change
- `InterviewScheduled.php` — Sent to candidate with interview details

### Queue Configuration (Future)

```php
// .env
QUEUE_CONNECTION=database
```

---

## File Structure Summary

After implementation, the following new files will be created:

```
app/
├── Http/
│   ├── Controllers/
│   │   ├── ApprovalPendingController.php
│   │   ├── OfferController.php
│   │   ├── WelcomeController.php
│   │   ├── Admin/
│   │   │   ├── ApplicationController.php
│   │   │   ├── CompanyController.php
│   │   │   ├── DashboardController.php
│   │   │   ├── OfferController.php
│   │   │   └── UserController.php
│   │   └── Candidate/
│   │       ├── ApplicationController.php
│   │       ├── DashboardController.php
│   │       └── ProfileController.php
│   ├── Middleware/
│   │   ├── EnsureUserIsActive.php
│   │   └── EnsureUserIsAdmin.php
│   └── Requests/
│       ├── ScheduleInterviewRequest.php
│       ├── StoreApplicationNoteRequest.php
│       ├── StoreApplicationRequest.php
│       ├── StoreCompanyRequest.php
│       ├── StoreOfferRequest.php
│       ├── UpdateApplicationStatusRequest.php
│       ├── UpdateCompanyRequest.php
│       ├── UpdateOfferRequest.php
│       └── UpdateProfileRequest.php
├── Notifications/
│   ├── ApplicationStatusChanged.php
│   ├── InterviewScheduled.php
│   ├── NewApplication.php
│   ├── UserApproved.php
│   └── UserRejected.php
└── Services/
    ├── ApplicationService.php
    ├── OfferService.php
    ├── ProfileStrengthService.php
    └── UserApprovalService.php

database/
├── factories/
│   ├── ApplicationFactory.php
│   ├── ApplicationNoteFactory.php
│   ├── CompanyFactory.php
│   ├── OfferFactory.php
│   ├── OfferScreenerQuestionFactory.php
│   ├── ProfileEducationFactory.php
│   ├── ProfileExperienceFactory.php
│   ├── ProfileFactory.php
│   ├── ProfileLanguageFactory.php
│   └── UserFactory.php (exists, modify)
└── seeders/
    ├── ApplicationSeeder.php
    ├── CompanySeeder.php
    ├── DatabaseSeeder.php (modify)
    ├── OfferSeeder.php
    ├── ProfileSeeder.php
    └── UserSeeder.php

tests/Feature/
├── Admin/
│   ├── ApplicationControllerTest.php
│   ├── CompanyControllerTest.php
│   ├── OfferControllerTest.php
│   └── UserControllerTest.php
├── ApplicationControllerTest.php
├── OfferControllerTest.php
└── ProfileControllerTest.php

resources/js/pages/admin/companies/   # NEW FRONTEND PAGES
├── index.tsx                          # Company listing
├── create.tsx                         # Create form
└── edit.tsx                           # Edit form
```

---

## Verification Plan

### Manual Verification Checklist

After completing all phases, verify:

1. **Seeders**: Run `php artisan migrate:fresh --seed` and confirm all tables populated
2. **Public Offers**: Visit `/offers` and verify real data displays
3. **Filters**: Test all offer filters (work mode, experience, urgent)
4. **Registration**: Create new user, confirm redirected to `/approval-pending`
5. **Admin Approval**: Login as admin, approve pending user
6. **Profile**: Update profile, upload resume
7. **Application**: Apply to an offer, verify it appears in `/my-applications`
8. **Admin Dashboard**: Verify all stats display correctly
9. **Offer CRUD**: Create, edit, toggle, delete offers as admin
10. **Application Pipeline**: Change status, add notes, schedule interviews
11. **Email Queue**: Verify emails are queued (check `jobs` table)

---

## Phase Summary

| Phase    | Deliverables                                             |
| -------- | -------------------------------------------------------- |
| Phase 1  | Factories, Seeders, Middleware                           |
| Phase 2  | Public Controllers (Welcome, Offers)                     |
| Phase 3  | Candidate Controllers (Dashboard, Profile, Applications) |
| Phase 4  | Admin Controllers (Full CRUD)                            |
| Phase 5  | Services Layer                                           |
| Phase 6  | Routes Refactoring                                       |
| Phase 7  | Frontend Integration + Company Management Pages          |
| Phase 8  | Validation                                    |
| DEFERRED | Email Notifications (future release)                     |

---

## Laravel Best Practices Applied

Per the project guidelines:

1. **Dependency Injection**: All services injected via constructor, no `new` in controllers
2. **Controller Hygiene**: Controllers only handle Request → Service → Response
3. **Form Requests**: All validation in dedicated Request classes
4. **Eloquent Scopes**: Using `active()`, `urgent()`, `verified()` scopes
5. **Chunking**: Using `chunk()` for bulk operations (user approval emails)
6. **Database Queue**: Using `database` driver for email notifications
7. **Typed PHP**: All new code uses `declare(strict_types=1)`
8. **Helpers**: Using `request()`, `session()`, `back()` helpers

---

## Known Risks & Mitigations

| Risk                      | Impact            | Mitigation                      |
| ------------------------- | ----------------- | ------------------------------- |
| Hostinger storage symlink | File uploads fail | Manual symlink script           |
| Email delivery delays     | Poor UX           | Database queue + retry logic    |
| Large data exports        | Memory issues     | Use `lazy()` or `cursor()`      |
| Slug uniqueness           | Route conflicts   | Unique validation + auto-suffix |

---

_Document created: January 10, 2026_  
_Status: APPROVED_
