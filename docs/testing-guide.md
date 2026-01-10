# JANUS Backend Testing Guide

> **Test Accounts:**
>
> - Admin: `admin@janus.ma` / `password`
> - Candidate: `candidat@janus.ma` / `password`

---

## 1. Authentication & Authorization

### 1.1 Registration

| Test                                       | Expected                                                               |
| ------------------------------------------ | ---------------------------------------------------------------------- |
| Register new user                          | User created with `status: pending`, redirected to `/approval-pending` |
| Try to access `/dashboard` before approval | Redirected to `/approval-pending`                                      |

### 1.2 Login

| Test                        | Expected                          |
| --------------------------- | --------------------------------- |
| Login as approved candidate | Redirected to `/dashboard`        |
| Login as pending user       | Redirected to `/approval-pending` |
| Login as admin              | Access to `/admin` routes         |

### 1.3 Middleware

| Test                                    | Expected                          |
| --------------------------------------- | --------------------------------- |
| Access `/admin` as candidate            | 403 Forbidden                     |
| Access candidate routes as pending user | Redirected to `/approval-pending` |

---

## 2. Public Pages

### 2.1 Homepage (`/`)

| Test                | Expected                                      |
| ------------------- | --------------------------------------------- |
| Load homepage       | Featured offers ticker displays active offers |
| Verify offers shown | Only `is_active: true` offers appear          |

### 2.2 Offers Listing (`/offers`)

| Test                       | Expected                         |
| -------------------------- | -------------------------------- |
| Load page                  | Paginated list of active offers  |
| Filter by type             | Only matching type shown         |
| Filter by work mode        | Only matching mode shown         |
| Filter by experience level | Correctly filtered               |
| Toggle "Urgent Only"       | Only `is_urgent: true` shown     |
| Search by keyword          | Title/description matches filter |
| Clear filters              | All offers shown                 |

### 2.3 Offer Detail (`/offers/{slug}`)

| Test                         | Expected                                                 |
| ---------------------------- | -------------------------------------------------------- |
| Load offer page (logged out) | "Initialize Application" button → redirects to register  |
| Load offer page (logged in)  | "Apply Now" button opens modal                           |
| Check company info           | Company name, sector, city, verified badge               |
| Check offer metadata         | Salary, deadline, positions, work mode, experience level |

---

## 3. Candidate Dashboard (`/dashboard`)

### 3.1 Stats

| Test               | Expected                         |
| ------------------ | -------------------------------- |
| Total Applications | Matches user's application count |
| Shortlisted count  | Correct status count             |
| Interviews count   | `status: interview` count        |
| Offers count       | `status: offered` count          |

### 3.2 Recent Applications

| Test             | Expected                                            |
| ---------------- | --------------------------------------------------- |
| List shows       | Last 5 applications with job title, company, status |
| Click "View all" | Navigates to `/my-applications`                     |

### 3.3 Upcoming Interviews

| Test                   | Expected                          |
| ---------------------- | --------------------------------- |
| If interview scheduled | Alert box shows interview details |
| Interview date/time    | Correctly formatted               |

### 3.4 Profile Strength

| Test               | Expected                              |
| ------------------ | ------------------------------------- |
| Progress bar       | Shows percentage completion           |
| Incomplete profile | Lower percentage, prompts to complete |

---

## 4. Applications (`/my-applications`)

### 4.1 Listing

| Test                  | Expected                                  |
| --------------------- | ----------------------------------------- |
| Load page             | All user applications shown               |
| Stats badges          | Total, Interviews, Offers counts accurate |
| Filter by status      | Server-side filter works                  |
| Search by job/company | Client-side search works                  |

### 4.2 Application Card

| Test                        | Expected                 |
| --------------------------- | ------------------------ |
| Shows job title             | ✓                        |
| Shows company name          | ✓                        |
| Shows location              | ✓                        |
| Shows status badge          | Correct color per status |
| Shows applied date          | ✓                        |
| Interview date if scheduled | Shows in card            |

### 4.3 Status Colors

| Status        | Color   |
| ------------- | ------- |
| `new`         | Yellow  |
| `viewed`      | Blue    |
| `shortlisted` | Violet  |
| `interview`   | Indigo  |
| `offered`     | Emerald |
| `hired`       | Green   |
| `rejected`    | Red     |
| `withdrawn`   | Gray    |

---

## 5. Candidate Profile (`/candidate-profile`)

### 5.1 Profile Edit

| Test            | Expected           |
| --------------- | ------------------ |
| Update headline | Saved successfully |
| Update phone    | Saved successfully |
| Update city     | Saved successfully |

### 5.2 Resume Upload

| Test           | Expected                   |
| -------------- | -------------------------- |
| Upload PDF     | File saved, path stored    |
| Upload non-PDF | Validation error           |
| Upload > 5MB   | Validation error           |
| Delete resume  | File removed, path cleared |

---

## 6. Application Submission

### 6.1 From Offer Page

| Test                    | Expected                     |
| ----------------------- | ---------------------------- |
| Click "Apply Now"       | Modal opens                  |
| Submit application      | Created with `status: new`   |
| Try to apply again      | Error: "Already applied"     |
| Apply to inactive offer | Error: "Offer not available" |

### 6.2 Withdraw Application

| Test                       | Expected                            |
| -------------------------- | ----------------------------------- |
| Withdraw `new` application | Status → `withdrawn`                |
| Withdraw `shortlisted`     | Status → `withdrawn`                |
| Withdraw `hired`           | Error: Cannot withdraw final status |

---

## 7. Admin Dashboard (`/admin`)

### 7.1 Stats

| Test               | Expected                  |
| ------------------ | ------------------------- |
| Total Users        | Candidate count           |
| Pending Approvals  | `status: pending` count   |
| Active Offers      | `is_active: true` count   |
| Total Applications | All applications count    |
| New Applications   | `status: new` count       |
| Verified Companies | `is_verified: true` count |

### 7.2 Recent Activity

| Test                | Expected                       |
| ------------------- | ------------------------------ |
| Recent applications | Last 10 with user, job, status |
| Pending users       | Last 5 pending users           |

---

## 8. Admin User Management (`/admin/users`)

### 8.1 Listing

| Test                 | Expected                        |
| -------------------- | ------------------------------- |
| Load page            | Paginated users list            |
| Search by name/email | Filters work                    |
| Filter by status     | `pending`, `active`, `rejected` |

### 8.2 Approval Flow

| Test         | Expected                                    |
| ------------ | ------------------------------------------- |
| Approve user | Status → `active`, can now access dashboard |
| Reject user  | Status → `rejected`                         |
| Bulk approve | Multiple users activated                    |
| Bulk reject  | Multiple users rejected                     |

---

## 9. Admin Offer Management (`/admin/offers`)

### 9.1 CRUD Operations

| Test          | Expected                                         |
| ------------- | ------------------------------------------------ |
| Create offer  | Validates required fields, generates unique slug |
| Edit offer    | Changes saved                                    |
| Toggle active | `is_active` flipped                              |
| Delete offer  | Removed (only if no applications)                |

### 9.2 Slug Generation

| Test                      | Expected                   |
| ------------------------- | -------------------------- |
| Create "Senior Developer" | Slug: `senior-developer`   |
| Create duplicate title    | Slug: `senior-developer-2` |

---

## 10. Admin Application Management (`/admin/applications`)

### 10.1 Listing

| Test             | Expected                                  |
| ---------------- | ----------------------------------------- |
| Load page        | All applications with user, offer, status |
| Filter by status | Works correctly                           |
| Filter by offer  | Works correctly                           |

### 10.2 Status Updates

| Test                               | Expected                                 |
| ---------------------------------- | ---------------------------------------- |
| Change `new` → `viewed`            | Valid transition                         |
| Change `viewed` → `shortlisted`    | Valid transition                         |
| Change `shortlisted` → `interview` | Valid transition                         |
| Schedule interview                 | `interview_at` set, status → `interview` |
| Add note                           | Note saved with author                   |

### 10.3 Valid Status Transitions

```
new → viewed → shortlisted → interview → offered → hired
                    ↓            ↓          ↓
                rejected     rejected    rejected
```

---

## 11. Admin Company Management (`/admin/companies`)

### 11.1 CRUD Operations

| Test            | Expected                    |
| --------------- | --------------------------- |
| Create company  | Saved with all fields       |
| Edit company    | Changes saved               |
| Toggle verified | `is_verified` flipped       |
| Upload logo     | Image saved                 |
| Delete company  | Removed (only if no offers) |

---

## 12. Services Logic

### 12.1 ProfileStrengthService

| Section    | Weight | Complete When                    |
| ---------- | ------ | -------------------------------- |
| Basic Info | 20%    | Headline, phone, city all filled |
| Resume     | 30%    | Resume uploaded                  |
| Education  | 15%    | At least 1 education entry       |
| Experience | 20%    | At least 1 experience entry      |
| Languages  | 15%    | At least 2 languages             |

### 12.2 StatsService

- Dashboard stats computed correctly
- Trends show last 30 days
- Top companies/offers by application count

---

## 13. Edge Cases

| Scenario              | Expected                       |
| --------------------- | ------------------------------ |
| No offers in database | Empty state message            |
| No applications       | Empty state on dashboard       |
| Offer deadline passed | Should not accept applications |
| User deletes account  | Applications remain (orphaned) |

---

## 14. Known Limitations

- Email notifications are deferred (placeholders in code)
- Profile education/experience/languages CRUD not fully implemented in frontend
- Admin pages still use some mock data hooks (can be updated later)

---

## Reporting Issues

When reporting an issue, please include:

1. **Page/Route** being tested
2. **Action** performed
3. **Expected** behavior
4. **Actual** behavior
5. **Browser console errors** (if any)
6. **Laravel log errors** (check `storage/logs/laravel.log`)
