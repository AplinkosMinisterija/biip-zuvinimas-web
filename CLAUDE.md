# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

BĮIP Žuvinimas WEB — a Lithuanian Ministry of Environment client application for managing fish stocking activities (registration, review, signing, history, exports). It's a PWA (installable, offline-aware) that talks to [biip-zuvinimas-api](https://github.com/AplinkosMinisterija/biip-zuvinimas-api) through a Vite dev-server proxy in development and through Caddy reverse proxying in production.

## Common commands

```bash
yarn install                # install deps (Node >=20 <21)
yarn start                  # vite dev server on http://localhost:8080
yarn build                  # tsc type-check then vite build → dist/
yarn serve                  # preview production build
yarn test                   # vitest (no tests currently — CI uses --passWithNoTests)
yarn lint                   # eslint over .js,.jsx,.ts,.tsx
```

A single test file: `yarn test path/to/file.test.ts` (vitest).

### Required env vars (Vite, must be `VITE_` prefixed)

- `VITE_PROXY_URL` — backend API origin used by the dev proxy (`/api/*` → this). Required for `yarn start` to talk to the API.
- `VITE_UETK_URL` — UETK (Lithuanian water bodies registry) API base; used directly (not proxied) by `api.getUetkLocations` for rivers/lakes search.
- `VITE_MAPS_HOST` — propagated as a Sentry `tracePropagationTargets` entry.
- `VITE_SENTRY_DSN`, `VITE_ENVIRONMENT`, `VITE_VERSION` — Sentry init (skipped when DSN is empty).

## Architecture

### Top-level flow

`src/index.tsx` mounts a fixed provider stack: `QueryClientProvider` → Redux `Provider` → `PersistGate` → styled-components `ThemeProvider` → `BrowserRouter` → `App`. `NetworkStatusIndicator` sits above the router to surface offline state globally; `GlobalStyle` injects base CSS (62.5% root font-size, Atkinson Hyperlegible, `overflow: hidden` on body).

`src/App.tsx` is the auth/route gate. On every location change it:

1. Refreshes the access token using the `refreshToken` cookie if `token` is missing (`api.refreshToken`).
2. Calls `useCheckAuthMutation` (`GET /auth/me`) to populate `state.user`.
3. Handles e-vartai (Lithuanian gov SSO) callback when `?ticket=` or `?eGates=` is in the URL — calls `eGatesLogin` or `eGatesSign`.
4. Splits routes into `PublicRoute` (login pages, redirects authed users away) and `ProtectedRoute` (everything else; redirects to `/profiles` when no profile selected, to `/zuvinimai` when one is).

Auth tokens live in cookies (`token`, `refreshToken`, `profileId`) via `universal-cookie`. `profileId` is sent as `X-Profile` header on every authed request (see `src/utils/api.ts:88-95`). Roles come from the API; only `USER_ADMIN` and `OWNER` see the tenant-users route (`useFilteredRoutes`).

### State

Redux Toolkit + redux-persist (key `speciesConfig`, localStorage, whitelist `['filters', 'user']`):

- `state/user/reducer.ts` — `userData` + `loggedIn` flag. Updated only after `/auth/me` succeeds.
- `state/filters/reducer.ts` — persisted list filters (so navigating away and back keeps filter state).
- `state/hooks.ts` — `useAppDispatch` / `useAppSelector` typed wrappers, plus `useGenericTablePageHooks` (page, navigate, dispatch, location bundle for list pages).

Server data uses `@tanstack/react-query` v5 (queries in `src/utils/hooks.ts`, mutations inline at call sites). There is no global error boundary on queries — most hooks call `handleAlert()` (toast) inside a `useEffect` watching `error`. Follow that pattern for new query hooks.

### API layer

`src/utils/api.ts` exposes a singleton `Api` class with two axios instances:

- `AuthApiAxios` — request interceptor prepends `/api` to every URL and attaches `Authorization: Bearer <token>` + `X-Profile: <profileId>`. The dev server (`vite.config.mts`) proxies `/api/*` → `VITE_PROXY_URL` and strips the prefix.
- `uetkAxios` — bare axios used for the external UETK endpoint (`VITE_UETK_URL/objects/search`).

Backend resource names are centralised in the `Resources` enum (`src/utils/constants.ts:16`). All list endpoints share `getCommonConfigs` which accepts `pageSize`, `page`, `populate`, `filter`, `search`, `searchFields`, `sort`, `query`, `scope`, `fields`, `geom`, `responseType`. Stick to this shape when adding endpoints.

Excel export bypasses axios and uses `fetch` directly because it returns a `Blob` (`api.getExcel`). File uploads use `multipart/form-data` per-file (`api.uploadFiles`).

### Routing

`src/utils/routes.tsx` declares Lithuanian-language slugs (`/zuvinimai`, `/profiliai`, `/imones_darbuotojai`, `/prisijungimas`, ...) — keep this convention when adding routes. Routes carry side-channel metadata used by the navbar/filter:

- `menu: true` — show in main nav
- `tenantOwner: true` — gate behind `USER_ADMIN`/`OWNER` role (enforced in `useFilteredRoutes`)

The `slugs` object exports both static paths and parameterised functions (`fishStocking(id)`), so use them instead of hard-coding URLs.

### Pages & forms

`src/pages/` is the route layer (FishStockings list, FishStocking detail, Profiles, MyProfile, TenantUsers, Login, CantLogin). `src/components/forms/` holds the four fish-stocking workflow forms (`Registration`, `Review`, `Unfinished`, `Done`) — these are large Formik + Yup forms that share field components from `src/components/fields/`. Validation schemas live in `src/utils/validations.ts`.

### Maps

Leaflet via raw `leaflet` (no react-leaflet). Three map components: `DisplayMap` (read-only), `PreviewMap`, `RegistrationMap` (interactive). `@turf/turf` is used for geometry ops. Map tile host comes from `VITE_MAPS_HOST`.

### Styling

Styled-components + a shared `Theme` from `@aplinkosministerija/design-system`. Colours and field/button tokens live in `src/styles/index.ts`. Status colours (`UPCOMING`, `ONGOING`, `FINISHED`, `INSPECTED`, `CANCELED`, `NOT_FINISHED`) are keyed off the `FishStockingStatus` enum.

Breakpoints: `device.mobileS/M/L` in `src/styles/index.ts` — mobileL is `max-width: 868px`, which is what most "mobile" media queries should target.

### PWA

`vite-plugin-pwa` with config in `manifest.js`. `registerType: 'autoUpdate'` ships a service worker that runtime-caches images (`CacheFirst`) and skips caching `/api/*`. The install prompt UI is in `src/components/other/PWAInstallerPrompt.tsx`.

## Conventions

- Use Lithuanian for user-facing strings (Lithuanian government app). Centralise them in `src/utils/texts.ts` when reused.
- Field components in `src/components/fields/` are the canonical inputs — prefer composing them over reaching for `@material-ui/core` (which is present but is being phased out by the design-system package).
- New API calls go through the `Api` class, not ad-hoc axios calls — keeps proxy prefix and auth headers consistent.
- Cookies (`token`, `refreshToken`, `profileId`) are the source of truth for auth, not Redux. Redux holds the _materialised_ user only.
- Husky + lint-staged run prettier + eslint on commit (`.husky/`). The shared configs come from `@aplinkosministerija/biip-prettier-config` and `@aplinkosministerija/eslint-config-biip-react`.

## Deployment

- `main` branch → automatic Staging deploy via `.github/workflows/deploy-staging.yml` (uses `AplinkosMinisterija/reusable-workflows/biip-deploy.yml`).
- GitHub Release → Production deploy.
- `Deploy to Development` workflow runs on demand for any branch.
- Each PR builds a Cloudflare Pages preview (`publish-preview` job in `ci.yml`).
- The container is a two-stage Docker build: Node 20 alpine for `yarn build`, then Caddy 2.6 alpine serving `dist/` from `/srv` with SPA fallback to `index.html` (`caddy/Caddyfile`).
- Sentry release tag = `VITE_VERSION` (passed in by the deploy workflow).
