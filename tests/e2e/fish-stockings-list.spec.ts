import { expect, test } from '@playwright/test';
import { clickButton, fillField, inputByLabel, pickDate, selectMultiOptions } from './helpers';
import { futureDate, isoDate } from './helpers';

const listResponse = '**/fishStockings**';

test.describe('Fish stockings list & filters', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/zuvinimai');
    await page.waitForLoadState('networkidle');
  });

  test('filter by location name', async ({ page }) => {
    await fillField(page, 'Telkinio Pavadinimas', 'Vilnia');
    const waitList = page.waitForResponse(listResponse).catch(() => null);
    await clickButton(page, 'Filtruoti');
    await waitList;
    await expect(inputByLabel(page, 'Telkinio Pavadinimas')).toHaveValue('Vilnia');
  });

  test('filter by status (multiselect)', async ({ page }) => {
    await selectMultiOptions(page, 'Būsena', ['Nauja']);
    const waitList = page.waitForResponse(listResponse).catch(() => null);
    await clickButton(page, 'Filtruoti');
    await waitList;
  });

  test('filter by date range', async ({ page }) => {
    await pickDate(page, 'Data nuo', isoDate(new Date()));
    await pickDate(page, 'Data iki', isoDate(futureDate(30)));
    const waitList = page.waitForResponse(listResponse).catch(() => null);
    await clickButton(page, 'Filtruoti');
    await waitList;
  });

  test('municipality and fish-type dropdowns open', async ({ page }) => {
    await inputByLabel(page, 'Savivaldybė').click();
    await page.keyboard.press('Escape');
    await inputByLabel(page, 'Žuvų rūšys').click();
    await page.keyboard.press('Escape');
  });

  test('"Išvalyti visus" resets the filters', async ({ page }) => {
    await fillField(page, 'Telkinio Pavadinimas', 'TestFilter');
    const waitList = page.waitForResponse(listResponse).catch(() => null);
    await clickButton(page, 'Išvalyti visus');
    await waitList;
    await expect(inputByLabel(page, 'Telkinio Pavadinimas')).toHaveValue('');
  });

  test('clicking a list item opens its detail page', async ({ page }) => {
    const items = page.getByTestId('fish-stocking-item');
    const count = await items.count();
    test.skip(count === 0, 'No fish stockings exist for this account to open.');
    await items.first().click();
    await expect(page).toHaveURL(/\/zuvinimai\/\d+/);
  });
});
