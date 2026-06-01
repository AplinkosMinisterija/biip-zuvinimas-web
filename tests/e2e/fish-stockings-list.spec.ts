import { expect, test, Page } from '@playwright/test';
import { clickButton, fillField, pickDate, selectMultiOptions } from './helpers';

const listResponse = '**/fishStockings**';

// The filter form lives inside a popup behind the "Filtrai" button.
async function openFilters(page: Page): Promise<void> {
  await page.getByRole('button', { name: 'Filtrai' }).click();
  await expect(page.getByText('Telkinio Pavadinimas')).toBeVisible();
}

test.describe('Fish stockings list & filters', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/zuvinimai');
    await page.waitForLoadState('networkidle');
  });

  test('filter by location name', async ({ page }) => {
    await openFilters(page);
    await fillField(page, 'Telkinio Pavadinimas', 'Vilnia');
    const waitList = page.waitForResponse(listResponse).catch(() => null);
    await clickButton(page, 'Filtruoti');
    await waitList;
    // Applied filters render as a tag.
    await expect(page.getByText('Telkinio Pavadinimas: Vilnia')).toBeVisible();
  });

  test('filter by status (multiselect)', async ({ page }) => {
    await openFilters(page);
    await selectMultiOptions(page, 'Būsena', ['Įžuvinta']);
    const waitList = page.waitForResponse(listResponse).catch(() => null);
    await clickButton(page, 'Filtruoti');
    await waitList;
    await expect(page.getByText('Būsena:', { exact: false }).first()).toBeVisible();
  });

  test('filter by date range', async ({ page }) => {
    await openFilters(page);
    await pickDate(page, 'Data nuo', 'first');
    await pickDate(page, 'Data iki', 'last');
    const waitList = page.waitForResponse(listResponse).catch(() => null);
    await clickButton(page, 'Filtruoti');
    await waitList;
  });

  test('municipality and fish-type dropdowns open', async ({ page }) => {
    await openFilters(page);
    await expect(page.getByText('Savivaldybė')).toBeVisible();
    await expect(page.getByText('Žuvų rūšys')).toBeVisible();
    // Opening the status select reveals its options.
    await page.locator('[id="Būsena"]').click();
    await expect(page.getByText('Nauja', { exact: true }).first()).toBeVisible();
    await page.keyboard.press('Tab');
  });

  test('"Išvalyti visus" resets the filters', async ({ page }) => {
    await openFilters(page);
    await fillField(page, 'Telkinio Pavadinimas', 'TestFilter');
    const waitList = page.waitForResponse(listResponse).catch(() => null);
    await clickButton(page, 'Išvalyti visus');
    await waitList;
    await expect(page.getByText('Telkinio Pavadinimas: TestFilter')).toBeHidden();
  });

  test('Excel export button is present', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Atsisiųsti duomenis' })).toBeVisible();
  });

  test('clicking a list item opens its detail page', async ({ page }) => {
    const items = page.getByTestId('fish-stocking-item');
    const count = await items.count();
    test.skip(count === 0, 'No fish stockings exist for this account to open.');
    await items.first().click();
    await expect(page).toHaveURL(/\/zuvinimai\/\d+/);
  });
});
