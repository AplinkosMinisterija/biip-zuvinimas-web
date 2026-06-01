import { expect, test, Page } from '@playwright/test';
import { fillField, inputByLabel } from './helpers';

/**
 * The "Faktiniai duomenys" (review) tab only exists on unfinished stockings;
 * completed ones render a read-only view with no tabs. We open a stocking and
 * skip gracefully when it has no review tab, and only fill + submit when the
 * fields are actually editable (ONGOING status).
 */
async function openReviewTab(page: Page): Promise<boolean> {
  await page.goto('/zuvinimai');
  await page.waitForLoadState('networkidle');
  const items = page.getByTestId('fish-stocking-item');
  if ((await items.count()) === 0) return false;
  await items.first().click();
  await expect(page).toHaveURL(/\/zuvinimai\/\d+/);
  const tab = page.getByText('Faktiniai duomenys');
  if (!(await tab.isVisible().catch(() => false))) return false;
  await tab.click();
  return true;
}

test.describe('Fish stocking review tab', () => {
  test('switching to the review tab renders the review fields', async ({ page }) => {
    const ok = await openReviewTab(page);
    test.skip(!ok, 'Opened stocking has no review tab (completed or no data).');
    await expect(page.getByText('VANDENS TEMPERATŪRA')).toBeVisible();
    await expect(inputByLabel(page, 'Važtaraščio nr.')).toBeVisible();
  });

  test('review fields accept input (when the stocking is editable)', async ({ page }) => {
    const ok = await openReviewTab(page);
    test.skip(!ok, 'Opened stocking has no review tab (completed or no data).');
    const waybill = inputByLabel(page, 'Važtaraščio nr.');
    await expect(waybill).toBeVisible();
    test.skip(await waybill.isDisabled(), 'Stocking is not ONGOING — review tab is read-only.');
    await fillField(page, 'Važtaraščio nr.', 'E2E-WB-001');
    await fillField(page, 'Pervežimo taroje', '16');
    await fillField(page, 'Telkininyje', '18');
    await fillField(page, 'Patvirtinimo nr.', 'E2E-VET-1');
    await expect(waybill).toHaveValue('E2E-WB-001');
    await expect(page.getByRole('button', { name: 'Išsaugoti' })).toBeVisible();
  });
});
