import { expect, test } from '@playwright/test';
import {
  clickButton,
  expectError,
  fillField,
  pickDate,
  pickTime,
  searchAndPickFirst,
  selectFirstOption,
  toggleCheckBox,
  waterBodyQuery,
} from './helpers';

test.describe('Create fish stocking (registration)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/zuvinimai/naujas');
    await page.waitForLoadState('networkidle');
  });

  test('submitting an empty form shows validation errors', async ({ page }) => {
    await clickButton(page, 'Išsaugoti');
    await expectError(page, 'Privalomas laukelis');
  });

  test('add and remove a fish batch row', async ({ page }) => {
    const rows = page.getByTestId('fish-batch-row');
    await expect(rows).toHaveCount(1);
    await clickButton(page, '+ Pridėti žuvį');
    await expect(rows).toHaveCount(2);
    // The delete icon is only shown when more than one row exists.
    await rows.first().locator('svg, i, [class*="Delete"]').last().click();
    await expect(rows).toHaveCount(1);
  });

  test('"kitos įmonės užsakymu" checkbox reveals the customer field', async ({ page }) => {
    await toggleCheckBox(page, 'Pažymėkite, jei įžuvinimą atliekate kitos įmonės užsakymu');
    await expect(page.getByText('Nurodykite užsakovo įmonės pavadinimą')).toBeVisible();
  });

  test('full happy path creates a real stocking', async ({ page }) => {
    // Water body (UETK async search).
    await searchAndPickFirst(page, 'Pasirinkite vandens telkinį', waterBodyQuery);

    // Date + time (must be scheduled ahead of the configured minimum lead time).
    await pickDate(page, 'Data', 'last');
    await pickTime(page, 'Laikas');

    // Fish origin defaults to "grown" -> fill the company name field.
    await fillField(page, 'Žuvivaisos įmonė', 'E2E Žuvininkystė');

    // First fish batch: species + age (options unknown, pick the first) + amount.
    const row = page.getByTestId('fish-batch-row').first();
    await selectFirstOption(row, 'Žuvų rūšis');
    await selectFirstOption(row, 'Amžius');
    await fillField(row, 'Kiekis', '100');

    const created = page.waitForResponse(
      (r) => /fishStockings\/register/.test(r.url()) && r.request().method() === 'POST',
    );
    await clickButton(page, 'Išsaugoti');
    const res = await created;
    expect(res.status(), 'register request should succeed').toBeLessThan(400);

    // We should leave the new-form route on success.
    await expect(page).not.toHaveURL(/\/zuvinimai\/naujas/, { timeout: 20_000 });
  });
});
