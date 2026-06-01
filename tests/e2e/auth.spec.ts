import { expect, test } from '@playwright/test';
import { clickButton, fillField, loginViaUi, selectProfile } from './helpers';

// These tests exercise the login form itself, so they must start LOGGED OUT —
// override the shared authenticated storage state with an empty one.
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Authentication', () => {
  test('login form validates empty fields', async ({ page }) => {
    await page.goto('/prisijungimas');
    await clickButton(page, 'Prisijungti');
    // Yup requireText error under both fields.
    await expect(page.getByText('Privalomas laukelis').first()).toBeVisible();
  });

  test('an invalid email does not log the user in', async ({ page }) => {
    // NOTE: Login.handleType calls setErrors({}) on every keystroke, which
    // suppresses the on-submit email-format message — so we assert the
    // meaningful outcome (login is blocked, we stay on the login page) rather
    // than a message the app doesn't actually render. See README "Findings".
    await page.goto('/prisijungimas');
    await fillField(page, 'Elektroninis paštas', 'not-an-email');
    await fillField(page, 'Slaptažodis', 'whatever');
    await clickButton(page, 'Prisijungti');
    await page.waitForTimeout(1000);
    await expect(page).toHaveURL(/\/prisijungimas/);
  });

  test('e-vartai (eGates) login button is always present', async ({ page }) => {
    await page.goto('/prisijungimas');
    await expect(
      page.getByRole('button', { name: 'Prisijungti per el. valdžios vartus' }),
    ).toBeVisible();
  });

  test('valid credentials log the user in', async ({ page }) => {
    await loginViaUi(page);
    await selectProfile(page);
    await expect(page).not.toHaveURL(/\/(prisijungimas|profiliai)\b/, { timeout: 20_000 });
  });
});
