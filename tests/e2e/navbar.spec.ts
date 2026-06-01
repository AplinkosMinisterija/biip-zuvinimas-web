import { expect, test } from '@playwright/test';

test.describe('Navbar & navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/zuvinimai');
    await page.waitForLoadState('networkidle');
  });

  test('"+Naujas" opens the new fish stocking form', async ({ page }) => {
    await page.getByRole('button', { name: '+Naujas' }).click();
    await expect(page).toHaveURL(/\/zuvinimai\/naujas/);
  });

  test('menu navigates to the fish stockings journal', async ({ page }) => {
    await page.getByText('Įžuvinimų žurnalas').click();
    await expect(page).toHaveURL(/\/zuvinimai(\b|$)/);
  });

  test('menu navigates to My profile', async ({ page }) => {
    await page.getByText('Mano profilis').first().click();
    await expect(page).toHaveURL(/\/mano-profilis/);
    await expect(page.getByRole('heading', { name: 'Mano profilis' })).toBeVisible();
  });

  test('profile dropdown opens and shows the logout action', async ({ page }) => {
    await page.getByTestId('profile-menu-trigger').click();
    await expect(page.getByTestId('logout')).toBeVisible();
    await expect(page.getByText('Atsijungti')).toBeVisible();
  });

  test('logout returns to the login page', async ({ page }) => {
    await page.getByTestId('profile-menu-trigger').click();
    await page.getByTestId('logout').click();
    await expect(page).toHaveURL(/\/prisijungimas/, { timeout: 20_000 });
  });
});
