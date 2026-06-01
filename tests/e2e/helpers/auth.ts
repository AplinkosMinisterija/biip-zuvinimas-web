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
  // Wait until we've either landed in the app or on the profile picker.
  await page.waitForLoadState('networkidle');
  if (!page.url().includes('/profiliai')) return;

  const items = page.locator('a');
  const target = creds.tenant ? items.filter({ hasText: creds.tenant }).first() : items.first();
  await expect(target).toBeVisible({ timeout: 15_000 });
  await target.click();
  // handleSelectProfile sets the profileId cookie and reloads the page.
  await page.waitForLoadState('networkidle');
}

/** Full login + profile selection, ending in the authenticated app. */
export async function login(page: Page): Promise<void> {
  await loginViaUi(page);
  await selectProfile(page);
  // We should be inside the app now (not on a login/profile route).
  await expect(page).not.toHaveURL(/\/(prisijungimas|profiliai)\b/, { timeout: 20_000 });
}
