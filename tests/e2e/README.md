# E2E tests (Playwright)

End-to-end tests covering every user action: button clicks, field fills, form
submissions, and filter usage.

## Quick start

1. Copy the env template and fill in your login details:

   ```bash
   cp .env.e2e.example .env.e2e
   ```

   Fill `.env.e2e`:

   ```
   E2E_BASE_URL=http://localhost:8080
   E2E_EMAIL=you@example.com
   E2E_PASSWORD=your-password
   E2E_TENANT=                 # optional: company name, if the account has several profiles
   E2E_WATER_BODY=Vilnia       # search term for a water body (must return a result)
   E2E_PERSONAL_CODE=          # optional: valid LT personal code for creating an employee
   PWSLOWMO=                   # optional: ms slow-down in headed mode, e.g. 250
   ```

   > `E2E_EMAIL`/`E2E_PASSWORD` only work against a NON-production backend (the
   > login form is hidden in production). Use an account with the required role:
   > OWNER/freelancer for stockings; USER_ADMIN for employees.

2. Make sure the main `.env` has `VITE_PROXY_URL` (staging API) and that
   `VITE_ENVIRONMENT` is not `production` (otherwise the email/password login
   form is hidden).

## Running and watching

```bash
yarn e2e:ui        # Playwright UI mode — watch every step, time-travel (RECOMMENDED)
yarn e2e           # headless + HTML report
yarn e2e:headed    # visible Chromium window (slow it down with PWSLOWMO)
yarn e2e:report    # open the last HTML report
```

Playwright starts `yarn start` itself (if not already running) and logs in once,
saving the session to `tests/e2e/.auth/state.json`.

Run a single file:

```bash
yarn e2e fish-stockings-list
yarn e2e:ui fish-stocking-create
```

## What is covered

| File                           | Actions                                                                      |
| ------------------------------ | ---------------------------------------------------------------------------- |
| `auth.spec.ts`                 | Login validation, successful login, eGates button                            |
| `navbar.spec.ts`               | "+Naujas", menu navigation, profile dropdown, logout                         |
| `profiles.spec.ts`             | Profile selection                                                            |
| `fish-stockings-list.spec.ts`  | Every filter (name, municipality, fish, status, dates), navigation to detail |
| `fish-stocking-create.spec.ts` | Full registration + real submit, fish batches, validation                    |
| `fish-stocking-review.spec.ts` | Actual-data (review) tab and fields                                          |
| `fish-stocking-done.spec.ts`   | "Kartoti" (repeat) of a completed stocking                                   |
| `my-profile.spec.ts`           | Phone/email editing, validation, "Išvalyti"/"Išsaugoti"                      |
| `tenant-users.spec.ts`         | Employee invite, validation, edit, delete (role-gated)                       |

## Important

- **Tests mutate REAL staging data.** `create` makes a real stocking; the full
  employee invite sends a real invitation (so it only runs when
  `E2E_PERSONAL_CODE` is set).
- Tests that need specific data (completed stockings, ONGOING status, admin
  role) automatically **skip** with a clear message when that data/permission is
  missing.
- Selector logic is centralized in `helpers/fields.ts` — if a design-system
  field changes, fix it in one place.

## Findings (app behavior noticed while writing tests)

- **Login email-format error is not shown.** `Login.handleType` calls
  `setErrors({})` on every keystroke, so entering an invalid email and
  submitting never surfaces the "Blogas el. pašto adresas" message (the
  required-field "Privalomas laukelis" message still shows fine). The
  corresponding test therefore asserts that login is BLOCKED rather than a
  message the app never renders. This is a likely UX bug worth fixing in
  `src/pages/Login.tsx`.
