import { expect, test } from '@playwright/test';
import { clickButton, dsField, fillField, selectOption } from './helpers';

// This whole area is gated behind USER_ADMIN / OWNER. If the logged-in profile
// is not an admin, the route is filtered out and we get redirected away — every
// test then skips with a clear reason.
test.describe('Tenant users', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/imones_darbuotojai');
    await page.waitForLoadState('networkidle');
    test.skip(
      !page.url().includes('/imones_darbuotojai'),
      'Account is not a tenant admin — no access to employees.',
    );
  });

  test('"Pridėti" opens the invite modal', async ({ page }) => {
    await clickButton(page, 'Pridėti');
    await expect(page.getByText('Pakviesti prisijungti prie įmonės')).toBeVisible();
  });

  test('invite modal validates required fields', async ({ page }) => {
    await clickButton(page, 'Pridėti');
    await page.getByText('Pakviesti prisijungti prie įmonės').waitFor();
    await clickButton(page, 'Išsaugoti');
    await expect(page.getByText('Privalomas laukelis').first()).toBeVisible();
  });

  test('invite modal rejects an invalid personal code', async ({ page }) => {
    await clickButton(page, 'Pridėti');
    await page.getByText('Pakviesti prisijungti prie įmonės').waitFor();
    await fillField(page, 'Vardas', 'Jonas');
    await fillField(page, 'Pavardė', 'Jonaitis');
    await fillField(page, 'Telefono numeris', '+37060000000');
    await fillField(page, 'Elektroninis paštas', 'e2e.jonas@example.com');
    await fillField(page, 'Asmens kodas', '11111111111');
    await clickButton(page, 'Išsaugoti');
    await expect(page.getByText('Neteisingas asmens kodo formatas')).toBeVisible();
  });

  test('can select a role in the invite modal', async ({ page }) => {
    await clickButton(page, 'Pridėti');
    await page.getByText('Pakviesti prisijungti prie įmonės').waitFor();
    // Open the role dropdown and confirm both options are offered.
    await page.locator('[id="Rolė"]').click();
    await expect(
      dsField(page, 'Rolė').getByText('Administratorius', { exact: true }),
    ).toBeVisible();
    await expect(dsField(page, 'Rolė').getByText('Naudotojas', { exact: true })).toBeVisible();
    // Pick one; the modal stays usable.
    await dsField(page, 'Rolė').getByText('Administratorius', { exact: true }).click();
    await expect(page.getByText('Pakviesti prisijungti prie įmonės')).toBeVisible();
  });

  test('cancel closes the modal', async ({ page }) => {
    await clickButton(page, 'Pridėti');
    await page.getByText('Pakviesti prisijungti prie įmonės').waitFor();
    await clickButton(page, 'Atšaukti');
    await expect(page.getByText('Pakviesti prisijungti prie įmonės')).toBeHidden();
  });

  test('full invite creates a real employee', async ({ page }) => {
    const code = process.env.E2E_PERSONAL_CODE;
    test.skip(
      !code,
      'Set E2E_PERSONAL_CODE (a valid LT personal code) to run the real invite flow.',
    );

    const stamp = `${Date.now()}`.slice(-6);
    await clickButton(page, 'Pridėti');
    await page.getByText('Pakviesti prisijungti prie įmonės').waitFor();
    await fillField(page, 'Vardas', 'E2E');
    await fillField(page, 'Pavardė', 'Testas');
    await fillField(page, 'Telefono numeris', '+37060000000');
    await fillField(page, 'Elektroninis paštas', `e2e.testas.${stamp}@example.com`);
    await fillField(page, 'Asmens kodas', code!);
    await selectOption(page, 'Rolė', 'Naudotojas');
    await clickButton(page, 'Išsaugoti');
    await expect(page.getByText('Pakviesti prisijungti prie įmonės')).toBeHidden({
      timeout: 15_000,
    });
  });

  test('opening an existing employee shows the edit modal', async ({ page }) => {
    const cards = page.getByTestId('tenant-user-card');
    test.skip((await cards.count()) === 0, 'No employees to edit.');
    await cards.first().click();
    await expect(page.getByText('Atnaujinti darbuotojo informaciją')).toBeVisible();
  });

  test('delete confirmation modal can be opened and cancelled', async ({ page }) => {
    const del = page.getByTestId('tenant-user-delete');
    test.skip((await del.count()) === 0, 'No employees to delete.');
    await del.first().click();
    await expect(page.getByText('Ar norite pašalinti įmonės darbuotoją')).toBeVisible();
    // DeleteCard's default decline label is "Atšaukti".
    await clickButton(page, 'Atšaukti');
    await expect(page.getByText('Ar norite pašalinti įmonės darbuotoją')).toBeHidden();
  });
});
