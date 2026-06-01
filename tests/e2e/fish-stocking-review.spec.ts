import { expect, test } from '@playwright/test';
import { fillField, inputByLabel } from './helpers';

/**
 * The "Faktiniai duomenys" (review) tab is only editable while a stocking is
 * ONGOING. We open an existing stocking and adapt: always verify the tab and
 * its fields render; only fill + submit when the fields are actually editable.
 */
test.describe('Fish stocking review tab', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/zuvinimai');
    await page.waitForLoadState('networkidle');
    const items = page.getByTestId('fish-stocking-item');
    test.skip((await items.count()) === 0, 'No fish stockings exist to review.');
    await items.first().click();
    await expect(page).toHaveURL(/\/zuvinimai\/\d+/);
  });

  test('switching to the review tab renders the review fields', async ({ page }) => {
    await page.getByText('Faktiniai duomenys').click();
    await expect(page.getByText('VANDENS TEMPERATŪRA')).toBeVisible();
    await expect(inputByLabel(page, 'Važtaraščio nr.')).toBeVisible();
  });

  test('review fields accept input (when the stocking is editable)', async ({ page }) => {
    await page.getByText('Faktiniai duomenys').click();
    const waybill = inputByLabel(page, 'Važtaraščio nr.');
    await expect(waybill).toBeVisible();
    if (await waybill.isDisabled()) {
      test.skip(true, 'Stocking is not ONGOING — review tab is read-only.');
    }
    await fillField(page, 'Važtaraščio nr.', 'E2E-WB-001');
    await fillField(page, 'Pervežimo taroje', '16');
    await fillField(page, 'Telkininyje', '18');
    await fillField(page, 'Patvirtinimo nr.', 'E2E-VET-1');
    await expect(waybill).toHaveValue('E2E-WB-001');
    await expect(page.getByRole('button', { name: 'Išsaugoti' })).toBeVisible();
  });
});
