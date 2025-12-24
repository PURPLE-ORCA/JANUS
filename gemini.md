> Status: Planning Phase
>
> > Deadline: 2026-01-20 (The clock is ticking, amigo)
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

I've put technologies documentations in /docs/context folder. Please read them before starting to implement to make sure you're using the best practices.

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
> - **CSS Variables**: Always use `var(--background)`, `var(--purple)`, etc.

### Phases

**Phase 1: Foundation & Data Layer** ✅

- [x] TypeScript interfaces (User, Profile, Offer, Application)
- [x] Mock JSON data files
- [x] Data hooks (`useOffers`, `useApplications`, etc.)

**Phase 2: Public Pages**

- [ ] Landing page redesign (`welcome.tsx`)
- [ ] Offers listing (`/offers`)
- [ ] Offer detail (`/offers/:slug`)
- [ ] Pending approval page

**Phase 3: Candidate Portal**

- [ ] Candidate dashboard with stats
- [ ] Profile builder/editor
- [ ] My Applications page
- [ ] Application modal/flow

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
