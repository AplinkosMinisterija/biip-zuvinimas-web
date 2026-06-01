import { expect, test } from '@playwright/test';
import { creds } from './helpers';

// The profile-selection screen normally only shows right after login. To test
// it in isolation we drop the profileId cookie and reload — the app then sends
// us back to /profiliai. Cookie edits here are scoped to this test's context.
test.describe('Profile selection', () => {
  test('shows the profile picker and selects a profile', async ({ page, context }) => {
    await page.goto('/zuvinimai');

    const cookies = await context.cookies();
    await context.clearCookies();
    await context.addCookies(cookies.filter((c) => c.name !== 'profileId'));

    await page.goto('/profiliai');
    await page.waitForLoadState('networkidle');

    // Accounts with a single profile auto-redirect; only assert the picker for
    // multi-profile accounts.
    if (page.url().includes('/profiliai')) {
      await expect(page.getByText('Pasirinkite paskyrą')).toBeVisible();
      await expect(page.getByText('Atsijungti')).toBeVisible();

      const profile = creds.tenant
        ? page.getByTestId('profile-item').filter({ hasText: creds.tenant }).first()
        : page.getByTestId('profile-item').first();
      await profile.click();
    }

    await expect(page).not.toHaveURL(/\/profiliai\b/, { timeout: 20_000 });
  });
});
