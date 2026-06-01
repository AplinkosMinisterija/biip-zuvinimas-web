import { Page, expect } from '@playwright/test';
import { clickButton, fillField } from './fields';

export const creds = {
  email: process.env.E2E_EMAIL || '',
  password: process.env.E2E_PASSWORD || '',
  tenant: process.env.E2E_TENANT || '',
};

export function assertCreds(): void {
  if (!creds.email || !creds.password) {
    throw new Error(
      'Missing E2E_EMAIL / E2E_PASSWORD. Copy .env.e2e.example -> .env.e2e and fill them in.',
    );
  }
}

/**
 * Drive the email/password login form. Works only against non-production
 * backends (the form is hidden in production). Leaves the browser on either
 * the profile-selection screen or, for single-profile accounts, the app.
 */
export async function loginViaUi(page: Page): Promise<void> {
  assertCreds();
  await page.goto('/prisijungimas');
  await fillField(page, 'Elektroninis paštas', creds.email);
  await fillField(page, 'Slaptažodis', creds.password);
  await clickButton(page, 'Prisijungti');
}

/**
 * After login, choose a profile if the selection screen appears. Single-profile
 * accounts auto-redirect, so this is a no-op for them. Picks E2E_TENANT by name
 * when set, otherwise the first profile.
 */
export async function selectProfile(page: Page): Promise<void> {
  // After submitting login the app first lands on the profile picker (or
  // auto-redirects straight into the app for single-profile accounts).
  await page.waitForURL(/\/(zuvinimai|profiliai)\b/, { timeout: 30_000 }).catch(() => undefined);

  if (page.url().includes('/profiliai')) {
    const items = page.getByTestId('profile-item');
    const target = creds.tenant ? items.filter({ hasText: creds.tenant }).first() : items.first();
    await target.click();
    // handleSelectProfile sets the profileId cookie and reloads the page.
  }

  // Either path must end inside the app, off the login/profile routes.
  await page.waitForURL((url) => !/\/(prisijungimas|profiliai)\b/.test(url.pathname), {
    timeout: 30_000,
  });
}

/** Full login + profile selection, ending in the authenticated app. */
export async function login(page: Page): Promise<void> {
  await loginViaUi(page);
  await selectProfile(page);
  // We should be inside the app now (not on a login/profile route).
  await expect(page).not.toHaveURL(/\/(prisijungimas|profiliai)\b/, { timeout: 20_000 });
}
