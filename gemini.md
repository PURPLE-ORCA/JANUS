> Status: Planning Phase
>
> > Deadline: 2026-01-20 (The clock is ticking)
> > Stack: Laravel (Monolith/Inertia) + React + MySQL
> > Theme: Minimalist Industrial (Black/White/Purple)

---

name meaning : Janus is the Roman god of **gates, doorways, and transitions**. He has two faces—one looking to the past (the candidate's resume) and one to the future (the job offer).

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

## 3. 💾 Database Schema (The Skeleton)

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

### `profiles` (Candidate Details)

| **Column**     | **Type** | **Notes**                                |
| -------------- | -------- | ---------------------------------------- |
| `id`           | BigInt   | PK                                       |
| `user_id`      | BigInt   | FK to `users`                            |
| `headline`     | String   | e.g., "Senior React Developer"           |
| `resume_path`  | String   | Path to PDF storage                      |
| `phone`        | String   | Contact info                             |
| `skills`       | JSON     | e.g., `["Laravel", "React", "sleeping"]` |
| `linkedin_url` | String   | Nullable                                 |

### `offers` (Job Listings)

| **Column**     | **Type** | **Notes**                                   |
| -------------- | -------- | ------------------------------------------- |
| `id`           | BigInt   | PK                                          |
| `slug`         | String   | Unique for SEO friendly URLs                |
| `title`        | String   | Job Title                                   |
| `description`  | Text     | HTML/Markdown (Use a rich text editor)      |
| `location`     | String   | City/Remote                                 |
| `salary_range` | String   | Nullable (e.g., "10k - 15k MAD")            |
| `type`         | Enum     | `'full-time'`, `'part-time'`, `'freelance'` |
| `is_active`    | Boolean  | Default `true`                              |
| `deadline`     | Date     | When the offer closes                       |

### `applications`

| **Column**   | **Type**  | **Notes**                                                     |
| ------------ | --------- | ------------------------------------------------------------- |
| `id`         | BigInt    | PK                                                            |
| `user_id`    | BigInt    | FK to `users`                                                 |
| `offer_id`   | BigInt    | FK to `offers`                                                |
| `status`     | Enum      | `'new'`, `'viewed'`, `'shortlisted'`, `'rejected'`, `'hired'` |
| `cover_note` | Text      | Short message from user                                       |
| `created_at` | Timestamp | Application date                                              |

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

### Phases

**Phase 1: Foundation & Data Layer** ✅

- [x] TypeScript interfaces (User, Profile, Offer, Application)
- [x] Mock JSON data files
- [x] Data hooks (`useOffers`, `useApplications`, etc.)

**Phase 2: Public Pages**

- [x] Landing page redesign (`welcome.tsx`)
- [x] Shared `GuestLayout` (`guest-layout.tsx`)
- [x] Offers listing (`/offers`)
- [x] Offer detail (`/offers/:slug`)
- [x] Pending approval page

**Phase 3: Candidate Portal**

- [x] Candidate dashboard with stats
- [x] Profile builder/editor
- [x] My Applications page
- [x] Application modal/flow

**Phase 4: Admin Dashboard**

- [ ] Admin dashboard with metrics
- [ ] User management (pending/active/rejected)
- [ ] Offers CRUD
- [ ] Applications review with drawer

**Phase 5: Shared Components**

- [ ] Status badges
- [ ] Stat cards
- [ ] Data table
- [ ] Offer cards
- [ ] Applicant detail sheet

**Phase 6: Polish**

- [ ] Responsive design verification
- [ ] Navigation flows
- [ ] Visual polish

### File Structure (New)

```
resources/js/
├── data/               # Mock JSON
├── hooks/use-mock-data.ts
├── components/
│   ├── status-badge.tsx
│   ├── stat-card.tsx
│   ├── data-table.tsx
│   └── offer-card.tsx
└── pages/
    ├── approval-pending.tsx
    ├── offers/
    ├── profile/
    ├── applications/
    └── admin/
```

---

## Progress Log

> **Last Updated**: December 25, 2024 8:00 PM - Phase 2 Complete

### What We've Implemented

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

### Phase 4: Admin Dashboard (In Progress)

> **Last Updated**: January 1, 2026 1:45 PM - Admin Layout Complete

#### Features Implemented

| Component               | File(s)                              | Description                                                                                                          |
| ----------------------- | ------------------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| **Admin Dashboard**     | `pages/admin/index.tsx`              | Stats grid (Pending Approvals, Active Offers, New Applications, Total Candidates), Quick Actions, Pending Users list |
| **Role-Based Sidebar**  | `components/app-sidebar.tsx`         | Conditional navigation - admins see admin routes, candidates see candidate routes. Uses `useMockRole()` hook         |
| **User Management**     | `pages/admin/users/index.tsx`        | Full data table with search, status filters (All/Pending/Active/Rejected), approve/reject actions                    |
| **Offers Management**   | `pages/admin/offers/index.tsx`       | Placeholder page with "Coming Soon" UI                                                                               |
| **Applications Review** | `pages/admin/applications/index.tsx` | Placeholder page with "Coming Soon" UI                                                                               |

#### Admin Navigation Structure

```
/admin              → Admin Dashboard (metrics + quick actions)
/admin/users        → User Management (approve/reject candidates)
/admin/offers       → Offers CRUD (coming soon)
/admin/applications → Applications Review (coming soon)
```

#### Key Patterns Established

1. **Role-Based Navigation**: `useMockRole()` hook returns `isAdmin` boolean; sidebar conditionally renders `adminNavItems` or `candidateNavItems`.

2. **Status Badge Helper**: `getStatusBadge()` function provides consistent badge styling for Pending (yellow), Active (green), Rejected (red).

3. **Admin Page Layout**: All admin pages use `AppLayout` with breadcrumbs starting with `Admin > [Page Name]`.

---

### What's Next: Phase 4 - Remaining Work

| Task                | Description                                                       | Priority |
| ------------------- | ----------------------------------------------------------------- | -------- |
| Offers CRUD         | **Complete** - Rich text editor, reusable form, create/edit pages | High     |
| Applications Review | Drawer/Sheet for applicant details with status change             | High     |
| User Actions        | Wire up Approve/Reject buttons with mock state                    | Medium   |

#### Offers CRUD Implementation Results

- **Rich Text Editor**: Integrated TipTap with a custom toolbar component (`rich-text-editor.tsx`).
- **Reusable Form**: `OfferForm` component handles both Create and Edit modes with auto-slug generation.
- **Pages**:
    - `admin/offers/index` - Table view with actions
    - `admin/offers/create` - New offer page
    - `admin/offers/[slug]/edit` - Edit offer page
- **Mock State**: Form submission mocks a network request and redirects.

---
