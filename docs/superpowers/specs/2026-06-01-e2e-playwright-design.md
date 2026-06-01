# E2E Playwright test suite — biip-zuvinimas-web

**Date:** 2026-06-01
**Status:** Approved

## Goal

A comprehensive Playwright end-to-end test suite that exercises **every user
action** in the app — button clicks, field fills, form submissions, and filter
usage — runnable locally so the developer can watch each flow pass. Login
credentials live in a gitignored env file the developer fills in.

## Decisions (locked)

- **Target:** Local dev. Playwright launches `yarn start` (localhost:8080);
  Vite proxy forwards `/api/*` → `VITE_PROXY_URL` (staging API).
- **Mutation depth:** Full flow — tests really submit forms and create real
  records on the staging backend.
- **Watch mode:** Playwright UI mode (`yarn e2e:ui`) primary; also headless +
  HTML report and headed.

## Environment & runner

- New `@playwright/test` dev dependency + `tests/e2e/` directory (separate from
  the existing vitest unit-test setup).
- `playwright.config.ts`:
  - `webServer`: `command: 'yarn start'`, `url: E2E_BASE_URL`,
    `reuseExistingServer: true`, generous timeout (Vite cold start).
  - `use.baseURL` = `E2E_BASE_URL`.
  - Projects: a `setup` project (global auth) + a `chromium` project that
    depends on it and loads the saved `storageState`.
  - `testDir: 'tests/e2e'`.
- Scripts in `package.json`:
  - `e2e` — headless run + HTML report
  - `e2e:ui` — Playwright UI mode (watch flows)
  - `e2e:headed` — headed Chromium with slowMo
  - `e2e:report` — open last HTML report

## Env files (login credentials)

- **`.env.e2e`** (gitignored — developer fills in):
  ```
  E2E_BASE_URL=http://localhost:8080
  E2E_EMAIL=...
  E2E_PASSWORD=...
  E2E_TENANT=            # optional: tenant name to pick when profile choice is ambiguous
  ```
- **`.env.e2e.example`** (committed template, commented).
- Add `.env.e2e` to `.gitignore`. Credentials never enter git.
- `playwright.config.ts` loads `.env.e2e` via `dotenv`.

## Authentication (one-time, via storageState)

`tests/e2e/global.setup.ts`:

1. Navigate to `/prisijungimas`.
2. Fill email + password (non-prod email/password form), submit.
3. On `/profiliai`, pick a profile (by `E2E_TENANT` if set, else the first).
4. Save cookies (`refreshToken`, `profileId`, `token`) to
   `tests/e2e/.auth/state.json`.

All tests load this `storageState`. `App.tsx` refreshes the short-lived access
token from the `refreshToken` cookie on mount, so the saved state stays valid.
`.auth/` is gitignored.

## Selector strategy

No `data-testid` attributes exist. Use accessibility selectors:
`getByLabel` (fields), `getByRole('button', {name})` (buttons), `getByText`
(list items, menu).

**First implementation step is a DOM probe:** confirm the design-system
`<label>` is actually associated with its `<input>` (`htmlFor`/`id` or nesting).
If `getByLabel` does not resolve, add a **minimal** `data-testid` set only where
the DOM is ambiguous: list rows (`EventItem`), tenant-user cards, fish-batch
rows, tab buttons, filter container. This is the only production-source change.

## Test files

| File                           | Covers                                                                                                                                                                                                     |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `auth.spec.ts`                 | Login form validation (empty / bad email), successful login, eGates button present, logout                                                                                                                 |
| `navbar.spec.ts`               | "+Naujas", every menu nav item, profile dropdown, profile switch, logout                                                                                                                                   |
| `profiles.spec.ts`             | Profile list, profile selection, logout from profiles                                                                                                                                                      |
| `fish-stockings-list.spec.ts`  | Each filter (location name, municipality, fish types, status, date from/to), navigate to detail, empty states, infinite scroll                                                                             |
| `fish-stocking-create.spec.ts` | Full registration: location, date, time, fish origin radio + conditional fields, assigned person, phone, customer checkbox, fish batches (add/remove, type/age/amount/weight), validation, **real submit** |
| `fish-stocking-review.spec.ts` | Review tab: waybill, water temps, vet info, actual quantities, photo upload, signatures, comments, submit                                                                                                  |
| `fish-stocking-done.spec.ts`   | Completed stocking "Kartoti" (repeat) button                                                                                                                                                               |
| `my-profile.spec.ts`           | Phone/email edit, "Išvalyti", "Išsaugoti", validation                                                                                                                                                      |
| `tenant-users.spec.ts`         | Add employee (all fields + personal code + role), validation, edit, delete (confirm modal) — role-gated                                                                                                    |

Shared helpers in `tests/e2e/helpers/`: selectors, a `loginViaUi` fallback, a
fixture that creates a known fish stocking for detail/review tests.

## Known constraints (documented in tests)

1. **Full flow mutates staging data** — `create` makes a real stocking,
   `tenant-users` invites a real user. Tests tag/identify their records (e.g. a
   recognizable note) and document cleanup. Destructive tests are isolated so
   they can be skipped via grep tag if needed.
2. **Tests depend on real staging data** (fish species, water bodies via UETK,
   profile role). If the logged-in profile lacks the needed role
   (OWNER/freelancer for stocking, USER_ADMIN for tenant users), those specs
   `test.skip()` with a clear message instead of failing.
3. **Map (Leaflet canvas) and signature canvas** are covered at the
   button/modal level; geometry is injected programmatically rather than via
   mouse drawing (unstable in E2E).

## Out of scope

- Offline/PWA service-worker testing.
- Visual regression / screenshot diffing.
- CI wiring (can follow once green locally).
