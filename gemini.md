> Status: **v0.2 — The Pivot** 🔄
>
> > Deadline: 2026-01-20 (The clock is ticking)
> > Stack: Laravel (Monolith/Inertia) + React + PostgreSQL
> > Theme: Minimalist Industrial (Black/White/Purple)

---

name meaning : Janus is the Roman god of **gates, doorways, and transitions**. He has two faces—one looking to the past (the candidate's resume) and one to the future (the job offer).

---

## 🔄 THE PIVOT: From Concept Art to Production Reality

> **Date**: January 1, 2026
> **Trigger**: Industry Analysis vs. Indeed, ReKrute.com, Emploi.ma
> **Verdict**: Beautiful UI, but missing 60% of recruitment-standard data

### Why We're Pivoting

After completing Phases 1-4 (frontend UI), we conducted a critical analysis comparing JANUS to industry standards. The findings:

| Criterion         | Score      | Problem                                              |
| ----------------- | ---------- | ---------------------------------------------------- |
| Visual Design     | ⭐⭐⭐⭐⭐ | None — it's exceptional                              |
| Data Completeness | ⭐⭐       | **Critical gaps in schema**                          |
| Morocco Standards | ⭐⭐       | Missing local norms (languages, Bac+X, city filters) |
| Admin Workflows   | ⭐⭐⭐     | No pipeline view, no bulk actions                    |

**The core issue**: We built a visually stunning frontend on top of an insufficient data model. If we wire the backend now, we'd ship an app that _looks_ professional but _functions_ like a toy.

### The New Focus

**Before**: "Make it look good" → **After**: "Make it work like ReKrute"

We are pivoting to:

1. **Extend the database schema** to industry standards
2. **Add Morocco-specific fields** (languages, nationality, Bac+X education)
3. **Professional vocabulary** (less "Velvet Rope", more practical HR language)
4. **Recruiter workflows** (pipeline view, bulk actions, notes)

## 1. 🎯 The Objective

Build a "Velvet Rope" recruitment platform. It is not an open job board. It is an exclusive club where the Recruitment Office (Admin) holds the keys. Users can look but can't touch (apply) until they are vetted.

**Key Constraints:**

- **Hostinger Hosting:** No fancy separate frontend/backend deployments. We stick to the monolith.
- **The Gatekeeper Logic:** New signups are "Pending" by default. They cannot apply until an Admin manually flips the switch.

---

## 2. 🛠 The Tech Stack (The "Hostinger Safe" Edition)

Since we are deploying on shared hosting (simple Git pull), we keep it tight.

- **Framework:** **Laravel 12**.
- **Frontend Glue:** **Inertia.js** (Vue or React, but you chose React). _Crucial for avoiding API token hell._
- **UI Library:** **React 19.2** + **Shadcn/ui** + **Tailwind CSS**.
- **Database:** PostgreSql (Standard).
- **Icons:** Iconify.
- **Package Manager:** Bun.

- **State Management:** Minimal needed (Inertia handles server state). Use `Zustand` if you get complex with filters.

---

## 3. 💾 Database Schema v0.2 (Industry Standard)

> [!IMPORTANT]
> This schema was revised on January 1, 2026 based on competitive analysis.
> New fields are marked with 🆕. Morocco-specific fields are marked with 🇲🇦.

### `companies` 🆕

| **Column**    | **Type** | **Notes**                              |
| ------------- | -------- | -------------------------------------- |
| `id`          | BigInt   | PK                                     |
| `name`        | String   | Company name                           |
| `logo_path`   | String   | Nullable path to logo                  |
| `website_url` | String   | Nullable                               |
| `sector`      | Enum     | tech, finance, healthcare, retail, etc |
| `description` | Text     | About the company                      |
| `city`        | String   | 🇲🇦 Headquarters location               |
| `is_verified` | Boolean  | Admin-verified company                 |
| `created_at`  | DateTime |                                        |

### `users`

| **Column**    | **Type** | **Notes**                                                  |
| ------------- | -------- | ---------------------------------------------------------- |
| `id`          | BigInt   | Primary Key                                                |
| `name`        | String   | Full Name                                                  |
| `email`       | String   | Unique                                                     |
| `password`    | String   | Hashed                                                     |
| `role`        | Enum     | `'admin'`, `'candidate'`                                   |
| `status`      | Enum     | `'pending'`, `'active'`, `'rejected'` (Default: `pending`) |
| `avatar_path` | String   | Nullable                                                   |

### `profiles` (Candidate Details) — EXTENDED

| **Column**            | **Type** | **Notes**                                                 |
| --------------------- | -------- | --------------------------------------------------------- |
| `id`                  | BigInt   | PK                                                        |
| `user_id`             | BigInt   | FK to `users`                                             |
| `headline`            | String   | e.g., "Senior React Developer"                            |
| `resume_path`         | String   | Path to PDF storage                                       |
| `phone`               | String   | Contact info                                              |
| `skills`              | JSON     | e.g., `["Laravel", "React"]`                              |
| `linkedin_url`        | String   | Nullable                                                  |
| `portfolio_url`       | String   | 🆕 Nullable                                               |
| `city`                | String   | 🆕🇲🇦 e.g., "Casablanca"                                   |
| `country`             | String   | 🆕 Default: "Morocco"                                     |
| `date_of_birth`       | Date     | 🆕🇲🇦 Required for Moroccan norms                          |
| `nationality`         | String   | 🆕🇲🇦 e.g., "Moroccan"                                     |
| `years_of_experience` | Integer  | 🆕 Total years                                            |
| `expected_salary`     | String   | 🆕 e.g., "25k-30k MAD"                                    |
| `availability`        | Enum     | 🆕 `'immediate'`, `'1_week'`, `'1_month'`, `'negotiable'` |
| `education_level`     | Enum     | 🆕🇲🇦 `'bac'`, `'bac+2'`, `'bac+3'`, `'bac+5'`, `'phd'`    |
| `has_driving_license` | Boolean  | 🆕🇲🇦 Common requirement                                   |

### `profile_education` 🆕

| **Column**    | **Type** | **Notes**                    |
| ------------- | -------- | ---------------------------- |
| `id`          | BigInt   | PK                           |
| `profile_id`  | BigInt   | FK to `profiles`             |
| `institution` | String   | School/University name       |
| `degree`      | String   | e.g., "Licence Informatique" |
| `field`       | String   | e.g., "Computer Science"     |
| `start_date`  | Date     |                              |
| `end_date`    | Date     | Nullable (if current)        |

### `profile_experience` 🆕

| **Column**    | **Type** | **Notes**             |
| ------------- | -------- | --------------------- |
| `id`          | BigInt   | PK                    |
| `profile_id`  | BigInt   | FK to `profiles`      |
| `company`     | String   | Employer name         |
| `title`       | String   | Job title             |
| `description` | Text     | Responsibilities      |
| `start_date`  | Date     |                       |
| `end_date`    | Date     | Nullable (if current) |
| `is_current`  | Boolean  | Still employed here   |

### `profile_languages` 🆕

| **Column**    | **Type** | **Notes**                                           |
| ------------- | -------- | --------------------------------------------------- |
| `id`          | BigInt   | PK                                                  |
| `profile_id`  | BigInt   | FK to `profiles`                                    |
| `language`    | String   | 🇲🇦 "French", "Arabic", "English", etc               |
| `proficiency` | Enum     | `'basic'`, `'intermediate'`, `'fluent'`, `'native'` |

### `offers` (Job Listings) — EXTENDED

| **Column**           | **Type** | **Notes**                                                   |
| -------------------- | -------- | ----------------------------------------------------------- |
| `id`                 | BigInt   | PK                                                          |
| `company_id`         | BigInt   | 🆕 FK to `companies`                                        |
| `slug`               | String   | Unique for SEO friendly URLs                                |
| `title`              | String   | Job Title                                                   |
| `description`        | Text     | HTML/Markdown (Use a rich text editor)                      |
| `location`           | String   | City/Remote                                                 |
| `work_mode`          | Enum     | 🆕 `'onsite'`, `'remote'`, `'hybrid'`                       |
| `salary_range`       | String   | Nullable (e.g., "10k - 15k MAD")                            |
| `type`               | Enum     | `'full-time'`, `'part-time'`, `'freelance'`, `'internship'` |
| `experience_level`   | Enum     | 🆕 `'junior'`, `'mid'`, `'senior'`, `'lead'`                |
| `education_required` | Enum     | 🆕🇲🇦 `'none'`, `'bac'`, `'bac+2'`, `'bac+3'`, `'bac+5'`     |
| `languages_required` | JSON     | 🆕 e.g., `["french", "english"]`                            |
| `benefits`           | JSON     | 🆕 e.g., `["health_insurance", "remote_days"]`              |
| `positions_count`    | Integer  | 🆕 Number of openings                                       |
| `views_count`        | Integer  | 🆕 Analytics                                                |
| `is_urgent`          | Boolean  | 🆕 "Urgently Hiring" badge                                  |
| `is_active`          | Boolean  | Default `true`                                              |
| `deadline`           | Date     | When the offer closes                                       |

### `offer_screener_questions` 🆕

| **Column**    | **Type** | **Notes**                              |
| ------------- | -------- | -------------------------------------- |
| `id`          | BigInt   | PK                                     |
| `offer_id`    | BigInt   | FK to `offers`                         |
| `question`    | String   | e.g., "Do you have a driving license?" |
| `type`        | Enum     | `'yes_no'`, `'text'`, `'number'`       |
| `is_required` | Boolean  | Must answer to apply                   |
| `order`       | Integer  | Display order                          |

### `applications` — EXTENDED

| **Column**           | **Type**  | **Notes**                                                                                                |
| -------------------- | --------- | -------------------------------------------------------------------------------------------------------- |
| `id`                 | BigInt    | PK                                                                                                       |
| `user_id`            | BigInt    | FK to `users`                                                                                            |
| `offer_id`           | BigInt    | FK to `offers`                                                                                           |
| `status`             | Enum      | `'new'`, `'viewed'`, `'shortlisted'`, `'interview'`, `'offered'`, `'rejected'`, `'hired'`, `'withdrawn'` |
| `cover_note`         | Text      | Short message from user                                                                                  |
| `screener_responses` | JSON      | 🆕 Answers to screener questions                                                                         |
| `rejection_reason`   | String    | 🆕 Nullable, filled when rejected                                                                        |
| `interview_at`       | DateTime  | 🆕 Scheduled interview date                                                                              |
| `created_at`         | Timestamp | Application date                                                                                         |

### `application_notes` 🆕

| **Column**       | **Type**  | **Notes**                 |
| ---------------- | --------- | ------------------------- |
| `id`             | BigInt    | PK                        |
| `application_id` | BigInt    | FK to `applications`      |
| `user_id`        | BigInt    | FK to `users` (recruiter) |
| `note`           | Text      | Recruiter's internal note |
| `created_at`     | Timestamp |                           |

---

## 4. 🌊 User Flows

### A. The "Purgatory" Auth Flow (User Side)

1. **Registration:** User fills Name, Email, Password.
2. **Immediate Redirect:** User is redirected to `/approval-pending`.
    - _UI:_ "Thanks for joining. Our team is reviewing your profile. Grab a coffee."
    - _Constraint:_ Access to any other route (except Logout) is blocked by `EnsureUserIsActive` middleware.

3. **Notification:** System sends an email to Admin: "New meat at the gate."

### B. The "God Mode" Flow (Admin Side)

1. **Validation:** Admin goes to `Dashboard > Users > Pending`.
2. **Action:** Admin clicks "Approve".
3. **System:** Updates `users.status = 'active'` -> Sends email to User: "You're in. Good luck."

### C. The Application Flow

1. **Discovery:** Active User browses `/offers`.
    - _Filters:_ Search by Title, Filter by Location/Type.

2. **Application:** User clicks "Apply Now".
    - _Check:_ If `profiles.resume_path` is null -> Redirect to Profile Builder.
    - _Action:_ Modal opens -> User types optional note -> Submit.

3. **Feedback:** Button changes to "Applied".

### D. The Recruitment Flow (Admin)

1. **Review:** Admin views `Offer Details > Applicants Tab`.
2. **Data Table:** See list of applicants (Name, Headline, Match %).
3. **Drill Down:** Click applicant -> Modal slides in with PDF Resume preview and Profile details.
4. **Decision:** Admin changes status to "Shortlisted" or "Rejected".

---

## 5. 🎨 UI & Design System

**Vibe:** Professional, stark, high contrast. "Serious Business."

- **Base Colors:**
    - Background: White (`#ffffff`)
    - Surface: Zinc-50 (`#fafafa`)
    - Text: Zinc-900 (`#18181b`)
- **Accent Color:** **Purple Orca**
    - Primary: Violet-600 (`#5617c2`) for buttons/active states.
    - Hover: Violet-700.
- **Components (Shadcn/Radix):**
    - **Data Table:** Mandatory for the Admin dashboard (sorting/filtering is free).
    - **Sheet/Drawer:** Use for viewing candidate profiles without leaving the list.
    - **Dialog:** For confirmation (Delete offer, Reject user).
    - **Badge:** Heavy use for Status (`Pending` = Yellow, `Active` = Green, `Rejected` = Red).
    - **Card:** For Job Offer listings.

---

## 6. ⚠️ Implementation Notes for Hostinger

Since we are limited by the environment:

1. **Storage:**
    - Do **not** try to use AWS S3 if the client didn't pay for it.
    - Use the `public` disk driver.
    - Run `php artisan storage:link`.
    - _Gotcha:_ On shared hosting, the symlink sometimes fails. You might need to manually create the symlink via a PHP script or cron job if you don't have SSH.

2. **Build Process:**
    - Hostinger likely won't let you run `npm run build` on the server.
    - **Workflow:** Build locally (`npm run build`). Commit the `build/` folder to a separate "deploy" branch OR upload the `build` folder manually via FTP (old school style).

3. **Email:**
    - Hostinger SMTP is okay but slow.
    - Use queues (`database` driver) so the user doesn't wait 10 seconds for the "Registration Successful" spinner while the email sends.

---

# SYSTEM ROLE & BEHAVIORAL PROTOCOLS

**ROLE:** Elite Full-Stack Architect (Laravel + React).
**STACK:** Laravel 12+ (API/Inertia), React 19.2+, TailwindCSS.
**MISSION:** Build "Janus" (Recruitment Platform) with production-grade stability.

## 1. OPERATIONAL DIRECTIVES (DEFAULT MODE)

- **Zero Tolerance for Bloat:** If it can be done in 5 lines, don't write 10.
- **Code First:** Don't explain the theory. Just fix the bug or build the feature.
- **Strictly Typed:** PHP strict typing is mandatory (`declare(strict_types=1);`).
- **Safety:** Always assume inputs are malicious.

## 2. THE "DEEP_ARCHITECT" PROTOCOL (TRIGGER COMMAND)

**TRIGGER:** When user prompts **"DEEP_ARCHITECT"**:

- **Audit Mode:** Analyze for tight coupling, N+1 queries, and security risks.
- **Refactor Mandate:** If the code works but breaks "Clean Code" principles, refactor it immediately.

## 3. FRONTEND STANDARD (REACT)

- **The 120-Line Rule:** Components > 120 lines are BANNED. Split them.
- **No PHP in JS:** Never inject Blade variables into JS (e.g., `let x = {{ $data }}`).
    - _Solution:_ Pass data via React Props or fetch via API. Use `data-attributes` only for simple DOM interactions.
- **Component Purity:** UI components are dumb. Logic belongs in Custom Hooks (`useCandidateFilters`).

## 4. BACKEND STANDARD (LARAVEL - THE GOLDEN RULES)

### A. Architecture & Coupling

- **Dependency Injection (IoC) ONLY:**
    - **FORBIDDEN:** `$user = new User();` inside controllers/services. This creates tight coupling and kills testing.
    - **REQUIRED:** Inject classes via the Constructor. Let the Service Container do the work.
- **Controller Hygiene:**
    - Controllers only handle: Request validation -> Call Service -> Return Response.
    - No Business Logic in Controllers. Move it to `App\Services`.

### B. Eloquent & Performance

- **Memory Safety (Chunking):**
    - **FORBIDDEN:** Using `all()` or `get()` on datasets that might grow (e.g., Candidates, Logs).
    - **REQUIRED:** Use `chunk()`, `lazy()`, or `cursor()` to handle data in batches.
- **Convention Over Configuration:**
    - Adhere to naming standards (Table: `candidates`, Model: `Candidate`).
    - Do not waste lines configuring `$table` or `$primaryKey` unless integrating with a legacy DB.

### C. Syntactic Sugar & Modern PHP

- **Write Less, Do More:**
    - Use Helpers: `session('key')` instead of `Session::get('key')`.
    - Use Helpers: `request('name')` instead of `$request->input('name')`.
    - Use Helpers: `back()` instead of `Redirect::back()`.
- **Eloquent Shortcuts:**
    - Use `latest()` instead of `orderBy('created_at', 'desc')`.
    - Use `compact('data')` instead of `with('data', $data)`.
- **PHP 8+ Features:**
    - Use Null Safe Operator: `$user->profile?->id` instead of `is_null` checks.
    - Use Named Arguments when clarity is needed.

## 5. DESIGN PHILOSOPHY: "PRAGMATIC CLEANLINESS"

- **No Over-Engineering:** Don't build a Repository pattern for simple CRUD. Use Services.
- **Naming:** Variables must be descriptive. `$c` is unacceptable. `$candidate` is perfect.

## 6. RESPONSE FORMAT

**IF NORMAL:**

1.  **The Fix:** Optimized code block.
2.  **The "Why":** A brief note on the specific Laravel rule applied (e.g., "Used `chunk()` to prevent memory overflow").

**IF "DEEP_ARCHITECT" IS ACTIVE:**

1.  **Code Audit:** Identify violations (Tight Coupling, Dirty JS injection, etc.).
2.  **Refactoring:** The breakdown.
3.  **The Code:** Production-ready solution.

## INSTRUCTIONS

name: frontend-design
description: Create distinctive, production-grade frontend interfaces with high design quality. Use this skill when the user asks to build web components, page. Generates creative, polished code that avoids generic AI aesthetics.

---

This skill guides creation of distinctive, production-grade frontend interfaces that avoid generic "AI slop" aesthetics. Implement real working code with exceptional attention to aesthetic details and creative choices.

The user provides frontend requirements: a component, page, or interface to build. They may include context about the purpose, audience, or technical constraints.

## Design Thinking

Before coding, understand the context and commit to a BOLD aesthetic direction:

- **Purpose**: What problem does this interface solve? Who uses it?
- **Tone**: Pick an extreme: brutally minimal, maximalist chaos, retro-futuristic, organic/natural, luxury/refined, playful/toy-like, editorial/magazine, brutalist/raw, art deco/geometric, soft/pastel, industrial/utilitarian, etc. There are so many flavors to choose from. Use these for inspiration but design one that is true to the aesthetic direction.
- **Constraints**: Technical requirements (framework, performance, accessibility).
- **Differentiation**: What makes this UNFORGETTABLE? What's the one thing someone will remember?

**CRITICAL**: Choose a clear conceptual direction and execute it with precision. Bold maximalism and refined minimalism both work - the key is intentionality, not intensity.

Then implement working code that is:

- Production-grade and functional
- Visually striking and memorable
- Cohesive with a clear aesthetic point-of-view
- Meticulously refined in every detail

## Frontend Aesthetics Guidelines

Focus on:

- **Typography**: Choose fonts that are beautiful, unique, and interesting. Avoid generic fonts like Arial and Inter; opt instead for distinctive choices that elevate the frontend's aesthetics; unexpected, characterful font choices. Pair a distinctive display font with a refined body font.
- **Color & Theme**: Commit to a cohesive aesthetic. Use CSS variables for consistency. Dominant colors with sharp accents outperform timid, evenly-distributed palettes.
- **Spatial Composition**: Unexpected layouts. Asymmetry. Overlap. Diagonal flow. Grid-breaking elements. Generous negative space OR controlled density.
- **Backgrounds & Visual Details**: Create atmosphere and depth rather than defaulting to solid colors. Add contextual effects and textures that match the overall aesthetic. Apply creative forms like gradient meshes, noise textures, geometric patterns, layered transparencies, dramatic shadows, decorative borders, custom cursors, and grain overlays.

NEVER use generic AI-generated aesthetics like overused font families (Inter, Roboto, Arial, system fonts), cliched color schemes (particularly purple gradients on white backgrounds), predictable layouts and component patterns, and cookie-cutter design that lacks context-specific character.

**IMPORTANT**: Match implementation complexity to the aesthetic vision. Maximalist designs need elaborate code with extensive animations and effects. Minimalist or refined designs need restraint, precision, and careful attention to spacing, typography, and subtle details. Elegance comes from executing the vision well.

There will be technologies documentations in /docs/context folder. read them before starting to implement to make sure you're using the best practices.

Remember: Gemini is capable of extraordinary creative work. Don't hold back, show what can truly be created when thinking outside the box and committing fully to a distinctive vision.

---

## 🚀 Frontend Implementation Plan

### Decisions Made

| Question         | Decision                                                            |
| ---------------- | ------------------------------------------------------------------- |
| Role Detection   | **UI Toggle** - Mock toggle to switch between admin/candidate views |
| Rich Text Editor | **TipTap** - React-first, lightweight                               |
| Data Table       | **Shadcn's Data Table**                                             |
| Testing          | **Manual verification**                                             |

### Development Rules

> [!IMPORTANT]
>
> - **Reusable Components First**: Heavily favor reusable components
> - **120+ Line Rule**: If any file exceeds 120 lines, request code cleaning
> - **Install Before Use**: Ask to install needed Shadcn components before starting a new page
> - **CSS Variables**: Always use `var(--background)`, `var(--purple)`, --foreground, etc.

### Phases (v0.2 Transformation Plan)

> [!NOTE]
> Phases 1-4 are from the original plan (UI-first). Phases 5-8 are the v0.2 pivot.

---

#### ✅ COMPLETED (Pre-Pivot)

**Phase 1: Foundation & Data Layer** ✅

- [x] TypeScript interfaces (User, Profile, Offer, Application)
- [x] Mock JSON data files
- [x] Data hooks (`useOffers`, `useApplications`, etc.)

**Phase 2: Public Pages** ✅

- [x] Landing page redesign (`welcome.tsx`)
- [x] Shared `GuestLayout` (`guest-layout.tsx`)
- [x] Offers listing (`/offers`)
- [x] Offer detail (`/offers/:slug`)
- [x] Pending approval page

**Phase 3: Candidate Portal** ✅

- [x] Candidate dashboard with stats
- [x] Profile builder/editor (⚠️ needs v0.2 fields)
- [x] My Applications page
- [x] Application modal/flow (⚠️ needs screener questions)

**Phase 4: Admin Dashboard** ✅ (Partial)

- [x] Admin dashboard with metrics
- [x] User management (pending/active/rejected)
- [x] Offers CRUD (⚠️ needs company link, new fields)
- [x] Applications review with drawer (⚠️ needs notes, pipeline)

---

#### 🔄 IN PROGRESS (v0.2 Pivot)

**Phase 5: v0.2 Schema Transformation** 🎯 CURRENT

> Priority: **CRITICAL** — Must complete before backend wiring

| Task                                             | Status | Notes                                |
| ------------------------------------------------ | ------ | ------------------------------------ |
| Create `Company` migration + model               | [ ]    | New entity for offers                |
| Create `ProfileEducation` migration + model      | [ ]    | One-to-many from Profile             |
| Create `ProfileExperience` migration + model     | [ ]    | One-to-many from Profile             |
| Create `ProfileLanguage` migration + model       | [ ]    | One-to-many from Profile             |
| Create `OfferScreenerQuestion` migration + model | [ ]    | Pre-screening questions              |
| Create `ApplicationNote` migration + model       | [ ]    | Recruiter notes                      |
| Extend `profiles` migration with new fields      | [ ]    | city, dob, nationality, etc.         |
| Extend `offers` migration with new fields        | [ ]    | company_id, work_mode, etc.          |
| Extend `applications` migration                  | [ ]    | screener_responses, rejection_reason |
| Update TypeScript types (`types/index.d.ts`)     | [ ]    | Match new schema                     |
| Update mock JSON data files                      | [ ]    | Add new fields with realistic data   |
| Update mock data hooks                           | [ ]    | Support new relationships            |

**Phase 5b: Frontend Schema Sync**

| Task                                              | Status | Notes                               |
| ------------------------------------------------- | ------ | ----------------------------------- |
| Update `profile-form.tsx` with new fields         | [ ]    | Education, experience, languages    |
| Add education/experience/language sub-forms       | [ ]    | Repeater pattern                    |
| Update `OfferCard` with company info              | [ ]    | Logo, company name                  |
| Add filters: experience level, work mode, sector  | [ ]    | On offers listing                   |
| Update `ApplicationModal` with screener questions | [ ]    | Dynamic form                        |
| Update admin offer form with new fields           | [ ]    | company selector, screener Q editor |

---

#### 🔜 NEXT (Post-Schema)

**Phase 6: Backend Integration**

| Task                                      | Priority | Notes                       |
| ----------------------------------------- | -------- | --------------------------- |
| Run migrations                            | High     | All new tables              |
| Create Laravel models with relationships  | High     | Eloquent                    |
| Create API controllers (Inertia-style)    | High     | Return props                |
| Replace mock hooks with real Inertia data | High     | Remove `use-mock-data.ts`   |
| File uploads (resume, company logo)       | High     | Storage driver              |
| User approval workflow (email)            | Medium   | Queue                       |
| CRUD controllers for admin                | Medium   | Offers, Users, Applications |

**Phase 7: Recruiter Workflows**

| Task                                   | Priority | Notes                       |
| -------------------------------------- | -------- | --------------------------- |
| Pipeline/Kanban view for applications  | High     | Drag-and-drop status change |
| Bulk actions (approve/reject multiple) | High     | Checkbox + action bar       |
| Application notes system               | Medium   | Recruiter comments          |
| Interview scheduling                   | Medium   | Date picker + calendar      |
| Email templates (rejection, invite)    | Low      | Template system             |
| Export to CSV                          | Low      | Reporting                   |

**Phase 8: Final Polish**

| Task                                 | Priority | Notes                                       |
| ------------------------------------ | -------- | ------------------------------------------- |
| Language softening                   | High     | Remove "Velvet Rope" theatrics from UI copy |
| Welcome page "For Employers" section | Medium   | Dual-sided landing                          |
| Social proof (stats, testimonials)   | Low      | Marketing                                   |
| PWA support                          | Low      | Mobile experience                           |
| Dark mode polish                     | Low      | Already exists                              |

---

### Transformation Checklist

```
v0.2 Transformation Progress
────────────────────────────
[ ] Schema extended (migrations)
[ ] Models created with relationships
[ ] TypeScript types updated
[ ] Mock data updated
[ ] Frontend forms updated
[ ] Backend controllers created
[ ] Mock hooks replaced with real data
[ ] Recruiter workflows implemented
[ ] Language/copy softened
────────────────────────────
Target: Backend-ready by Jan 10, 2026
Launch: Jan 20, 2026
```

### File Structure (v0.2)

```
resources/js/
├── data/                     # Mock JSON (to be replaced)
│   ├── companies.json        # 🆕
│   ├── offers.json           # EXTENDED
│   ├── profiles.json         # EXTENDED
│   └── applications.json     # EXTENDED
├── hooks/use-mock-data.ts    # → Will become use-data.ts (real)
├── components/
│   ├── status-badge.tsx
│   ├── stat-card.tsx
│   ├── data-table.tsx
│   ├── offer-card.tsx        # → Add company info
│   ├── company-avatar.tsx    # 🆕
│   ├── pipeline-board.tsx    # 🆕
│   └── screener-form.tsx     # 🆕
└── pages/
    ├── offers/
    │   └── partials/
    │       └── application-modal.tsx  # → Add screener questions
    ├── profile/
    │   └── partials/
    │       ├── profile-form.tsx       # → Add education/experience/languages
    │       ├── education-form.tsx     # 🆕
    │       ├── experience-form.tsx    # 🆕
    │       └── languages-form.tsx     # 🆕
    └── admin/
        ├── applications/
        │   ├── index.tsx              # → Add pipeline view
        │   └── partials/
        │       ├── pipeline-board.tsx # 🆕
        │       └── notes-panel.tsx    # 🆕
        └── offers/
            └── partials/
                └── screener-editor.tsx # 🆕
```

---

## Progress Log

> **Last Updated**: January 1, 2026 — 🔄 v0.2 PIVOT INITIATED
>
> **Current Phase**: 5 (Schema Transformation)
> **Status**: Extending database schema to industry standards

### Historical Changelog

#### 🔄 v0.2 Pivot (January 1, 2026)

- Conducted competitive analysis vs. Indeed, ReKrute.com, Emploi.ma
- Identified critical gaps in data model (missing 60% of industry-standard fields)
- Pivoted from "backend wiring" to "schema extension first"
- Updated phases 5-8 with transformation plan
- Added new entities: `Company`, `ProfileEducation`, `ProfileExperience`, `ProfileLanguage`, `OfferScreenerQuestion`, `ApplicationNote`

---

### Pre-Pivot Implementation (Dec 2024)

#### Phase 1: Foundation & Data Layer ✅

| Component         | File                     | Description                                                                  |
| ----------------- | ------------------------ | ---------------------------------------------------------------------------- |
| TypeScript Types  | `types/index.d.ts`       | Extended with `UserRole`, `UserStatus`, `Profile`, `Offer`, `Application`    |
| Mock Users        | `data/users.json`        | Sample users with admin/candidate roles and pending/active/rejected statuses |
| Mock Profiles     | `data/profiles.json`     | Candidate profiles with optional `resume_path` and `linkedin_url`            |
| Mock Offers       | `data/offers.json`       | Job listings with HTML-rich descriptions, various types and locations        |
| Mock Applications | `data/applications.json` | Application records linking users to offers                                  |
| Data Hooks        | `hooks/use-mock-data.ts` | `useOffers`, `useOffer`, `useApplications`, `usePendingUsers`, `useMockRole` |

#### Phase 2: Public Pages ✅

| Page             | Route               | Key Features                                                             |
| ---------------- | ------------------- | ------------------------------------------------------------------------ |
| Landing Page     | `/`                 | Animated hero, live offers ticker, "The Protocol" section, `GuestLayout` |
| Offers Listing   | `/offers`           | Real-time search/filter, responsive grid, `OfferCard` component          |
| Offer Details    | `/offers/:slug`     | Rich text description, two-column layout, conditional "Apply" button     |
| Pending Approval | `/approval-pending` | "Under review" messaging, logout functionality, animated shield icon     |

#### Shared Components Created

- **`GuestLayout`**: Reusable layout with glassmorphism Navbar, Footer, and NoiseOverlay
- **`OfferCard`**: Industrial-styled job card with hover effects and sanitized description preview

---

### Decisions Made

| Decision           | Choice                                     | Rationale                                                       |
| ------------------ | ------------------------------------------ | --------------------------------------------------------------- |
| Design Philosophy  | Minimalist Industrial (Black/White/Purple) | Aligns with "Velvet Rope" elite recruitment concept             |
| Animation Library  | Framer Motion                              | React-first, lightweight, smooth entry animations               |
| Typography Plugin  | `@tailwindcss/typography`                  | Required for rendering HTML job descriptions                    |
| Type Definitions   | Union types over enums                     | `.d.ts` files cannot export runtime values; use string literals |
| Mock Data Strategy | JSON files + hooks                         | Frontend-first development without backend dependency           |

---

### Problems Encountered & Solutions

#### 1. TypeScript Enum in `.d.ts` File

**Error**: `Could not load /resources/js/types` when importing `OfferType` as a value.

**Cause**: Defined `OfferType` as an enum in `index.d.ts`, but `.d.ts` files are declaration-only and cannot export runtime values.

**Fix**: Changed `OfferType` to a union type (`'full-time' | 'part-time' | 'freelance'`) and used string literals directly in components instead of `OfferType.FULL_TIME`.

---

#### 2. Raw HTML in OfferCard Description

**Error**: Job descriptions displayed as `<h2>About the Role</h2>...` instead of formatted text.

**Cause**: `offer.description` contains HTML markup from `offers.json`.

**Fix**: For card previews, strip HTML tags using regex: `offer.description.replace(/<[^>]+>/g, '')`. For detail pages, use `dangerouslySetInnerHTML` with `@tailwindcss/typography` styles.

---

#### 3. Tailwind Typography Plugin Not Rendering

**Error**: `prose` classes had no effect on the Offer Details page.

**Cause**: `@tailwindcss/typography` was not installed or configured for Tailwind v4.

**Fix**:

1. Install: `bun add -D @tailwindcss/typography`
2. Register in `app.css`: `@plugin "@tailwindcss/typography";`

---

#### 4. Tailwind v4 Syntax Lint Warnings

**Warning**: `h-[800px]` should be `h-200`, `bg-gradient-to-r` should be `bg-linear-to-r`.

**Cause**: Tailwind v4 uses new syntax for arbitrary values and gradients.

**Fix**: Updated classes to v4 syntax (`h-200`, `w-75`, `bg-linear-to-r`).

---

#### 5. Avatar Null vs Undefined Type Mismatch

**Error**: Type error when `user.avatar` is `null` (from JSON) but `AvatarImage` expects `string | undefined`.

**Fix**: Convert null to undefined: `src={user.avatar ?? undefined}`.

---

### Key Learnings

1. **`.d.ts` files are for types only** - Never define enums or const values that need runtime access. Use union types or move to a `.ts` file.

2. **Tailwind v4 has breaking changes** - Arbitrary values have standard equivalents (e.g., `[800px]` → `200`), gradients use `bg-linear-*` instead of `bg-gradient-*`.

3. **HTML content needs sanitization** - For previews, strip tags. For full display, use `dangerouslySetInnerHTML` with appropriate styling.

4. **Plugins in Tailwind v4** - Use `@plugin "package-name"` syntax in CSS, not `tailwind.config.js`.

5. **Frontend-first development** - Mock data hooks enable full UI development without backend; transition to real APIs later by swapping hook implementations.

---

### Instructions for Future Development

> [!IMPORTANT]
> **Before starting any new page:**
>
> 1. Check if required Shadcn components are installed
> 2. Review `/docs/context/` for framework best practices
> 3. Use CSS variables (`var(--purple)`, `var(--background)`)
> 4. Keep files under 120 lines - extract components proactively

> [!WARNING]
> **Common Pitfalls to Avoid:**
>
> - Don't use enums in `.d.ts` files if you need runtime values
> - Don't forget to sanitize HTML in card previews
> - Don't use old Tailwind syntax (`bg-gradient-*`, arbitrary `[Xpx]`)
> - Don't import types without `import type { ... }` if not using at runtime

> [!TIP]
> **Productivity Tips:**
>
> - `useMockRole()` hook enables testing different user experiences
> - `GuestLayout` handles navbar/footer - just wrap content
> - `OfferCard` is reusable for any listing context
> - Run `bun run build` after major changes to catch type errors early

---

### Phase 3: Candidate Portal ✅ (Completed Dec 25, 2024)

> **Last Updated**: December 25, 2024 8:14 PM - Phase 3 Complete

#### Features Implemented

| Component                | File(s)                                                                                               | Description                                                                                                                                       |
| ------------------------ | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Candidate Dashboard**  | `pages/dashboard.tsx`, `components/stat-card.tsx`                                                     | Welcome message, Stats grid (Total Applications, In Review, Shortlisted, Rejected), Recent Applications preview, Profile Strength widget with CTA |
| **Profile Builder**      | `pages/profile/edit.tsx`, `pages/profile/partials/profile-form.tsx`, `components/ui/skills-input.tsx` | Editable headline, phone, LinkedIn. Animated skill tags with add/remove. Mock resume upload section                                               |
| **My Applications Page** | `pages/applications/index.tsx`                                                                        | Full applications list with search, status filters (Active/Archived), metrics cards, color-coded status badges                                    |
| **Application Modal**    | `pages/offers/partials/application-modal.tsx`                                                         | Dialog with applicant details, drag-and-drop resume upload, cover note textarea, loading/success states                                           |

#### Mock Data Expansion

| File                | Records | Coverage                                                                        |
| ------------------- | ------- | ------------------------------------------------------------------------------- |
| `users.json`        | 16      | Admin, Candidates (Active/Pending/Rejected)                                     |
| `profiles.json`     | 15      | Complete, Partial (no resume), Empty                                            |
| `offers.json`       | 15      | Full-time, Part-time, Freelance; Active & Closed                                |
| `applications.json` | 30      | All 7 statuses: new, viewed, shortlisted, interview, rejected, hired, withdrawn |

#### Problems Encountered & Solutions

##### 1. `PageProps` Import Error in Profile Edit Page

**Error**: `Module '@inertiajs/react' has no exported member 'PageProps'`

**Cause**: Inertia's TypeScript types changed; `PageProps` is not directly exported.

**Fix**: Define an inline interface for component props instead of importing `PageProps`.

---

##### 2. Duplicate Route Declaration Conflict

**Error**: Babel parser error in `routes/profile/index.ts` due to duplicate `edit` export.

**Cause**: Laravel Vite Wayfinder auto-generated a route that conflicted with our new profile edit route.

**Fix**: Renamed the route from `/profile` to `/candidate-profile` to avoid conflict.

---

##### 3. Empty Applications List on My Applications Page

**Error**: "No applications found" despite having mock data.

**Cause**: Mock applications in `applications.json` had `user_id: 2` and `3`, but the logged-in user was `user_id: 1`.

**Fix**: Expanded `applications.json` with entries for `user_id: 1` covering all statuses.

---

##### 4. Resume Upload Non-Functional

**Error**: Clicking the upload area didn't open file explorer; drag-and-drop didn't work.

**Cause**: The upload zone was just a styled `div` without an actual `<input type="file">` or event handlers.

**Fix**: Added hidden file input with `htmlFor` label binding, plus `onDragOver` and `onDrop` handlers for drag-and-drop support.

---

#### Key Learnings

1. **Inertia's `useForm` for Form State** - Handles form data, processing state, and reset without additional libraries. The `setData('field', value)` pattern is clean for controlled inputs.

2. **Dialog State Pattern** - Using `useState` to control dialog visibility (`isOpen`/`onClose`) allows the parent component to trigger modals from anywhere (e.g., button click).

3. **File Upload UX Best Practices**:
    - Always pair a hidden `<input type="file">` with a styled `<label>` for click-to-upload.
    - Add `onDragOver={(e) => e.preventDefault()}` to enable drop zones.
    - Show file name and size immediately upon selection for user feedback.

4. **Status Badge Color Mapping** - Using a switch/case function for status colors ensures consistency across the app and makes adding new statuses trivial.

5. **Mock Data Strategy Evolution** - Initially minimal data was fine, but realistic testing required:
    - Multiple users with different roles/statuses
    - Applications for the logged-in user specifically
    - All possible status values represented

6. **Component Colocation Convention** - Placing modal components in `pages/{entity}/partials/` keeps related code together without polluting the global components directory.

---

#### Instructions for Future Development (Phase 3 Specific)

> [!IMPORTANT]
> **Candidate Portal Patterns:**
>
> - Use `useCandidateStats()` and `useApplications()` hooks for data
> - The `StatCard` component accepts `icon` (Iconify string), `label`, `value`, and optional `trend`
> - Application status colors are defined in `getStatusColor()` function - extend it for new statuses
> - Modal components live in `pages/{entity}/partials/` directory

> [!WARNING]
> **Common Pitfalls:**
>
> - `user.profile?.resume_path` may be `null` - always check before displaying
> - Mock data `user_id` must match logged-in user for testing
> - File inputs need `htmlFor` label binding + hidden input pattern for custom styling
> - Always prevent default on `onDragOver` for drop zones to work

> [!TIP]
> **Reusable Components Created:**
>
> - `StatCard` - Dashboard metric cards with icons
> - `SkillsInput` - Tag-based skill input with animations
> - `ApplicationModal` - Full application flow with file upload
> - Status badge color helper function in `applications/index.tsx`

---

### Phase 4: Admin Dashboard (Complete)

> **Completed**: January 1, 2026 - Full Admin Dashboard Implementation

#### Features Implemented

| Component               | File(s)                              | Description                                                                                         |
| ----------------------- | ------------------------------------ | --------------------------------------------------------------------------------------------------- |
| **Admin Dashboard**     | `pages/admin/index.tsx`              | Stats grid (Pending Approvals, Active Offers, New Applications, Total Candidates), Quick Actions    |
| **Role-Based Sidebar**  | `components/app-sidebar.tsx`         | Conditional navigation - admins see admin routes, candidates see candidate routes                   |
| **User Management**     | `pages/admin/users/index.tsx`        | Full data table with search, status filters (All/Pending/Active/Rejected), approve/reject actions   |
| **Offers CRUD**         | `pages/admin/offers/*`               | Create/Edit forms with Rich Text Editor (TipTap), slug auto-generation, data table with actions     |
| **Applications Review** | `pages/admin/applications/*`         | Grouped Accordions by Job Offer, Candidate Drawer (Sheet), Status Actions (Shortlist/Reject/Viewed) |
| **Rich Text Editor**    | `components/ui/rich-text-editor.tsx` | TipTap-based editor with toolbar (headings, bold, italic, lists, links, blockquote)                 |

#### Admin Navigation Structure

```
/admin                     → Admin Dashboard (metrics + quick actions)
/admin/users               → User Management (approve/reject candidates)
/admin/offers              → Offers List (table with actions)
/admin/offers/create       → Create New Offer
/admin/offers/{slug}/edit  → Edit Existing Offer
/admin/applications        → Applications Review (grouped by offer)
```

---

#### Key Learnings

1. **Role-Based Routing**: `useMockRole()` hook pattern allows easy toggling between admin/candidate views during development.

2. **TipTap Integration**: Headless editor provides full control over styling. Use `@tailwindcss/typography` plugin for prose styling in the editor content.

3. **Enterprise UX Patterns**:
    - **Grouped Views**: Organizing data by context (e.g., applications by offer) reduces cognitive load.
    - **Drawer/Sheet**: Side-sheet pattern (`Sheet` component) keeps users in context while viewing details.
    - **Collapsible Accordions**: Radix `Collapsible` primitives work well for expandable sections.

4. **Auto-Slug Generation**: Using `toLowerCase().replace(/ /g, '-')` on title change provides instant slug preview during form entry.

5. **Status Badge Consistency**: Centralized `getStatusColor()` helper ensures uniform status styling across pages.

---

#### Instructions for Future Development (Phase 4 Specific)

> [!IMPORTANT]
> **Admin Page Patterns:**
>
> - All admin pages use `AppLayout` with breadcrumbs starting with `Admin > [Page Name]`
> - Use `useOffers()`, `useApplications()`, `useUsers()` hooks for mock data
> - Forms should use local state with `useState` until backend is integrated

> [!TIP]
> **Reusable Components Created:**
>
> - `RichTextEditor` - TipTap wrapper with toolbar
> - `OfferForm` - Reusable for create/edit modes
> - `ApplicationDetailsDrawer` - Sheet-based candidate viewer
> - `StatCard` - Dashboard metric cards

---

### What's Next: Phase 5 - Backend Integration

| Task                  | Description                                            | Priority |
| --------------------- | ------------------------------------------------------ | -------- |
| Offers API            | Create Laravel controllers for Offers CRUD             | High     |
| Applications API      | Implement status update endpoints                      | High     |
| User Approval API     | Wire up approve/reject buttons to backend              | High     |
| Auth Role Middleware  | Protect admin routes with `role:admin` middleware      | Critical |
| Real Data Integration | Replace mock hooks with Inertia props from controllers | High     |

---
