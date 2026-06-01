/**
 * Centralized selector + interaction helpers for the @aplinkosministerija
 * design-system fields. ALL fragile selector logic lives here so there is ONE
 * place to adjust if a control's DOM differs.
 *
 * What we learned by probing the live app + the design-system source:
 *
 *  - Text fields (TextField / PasswordField / NumericTextField / PhoneField)
 *    are CUSTOM. They render <input id="<label text>">. The <label htmlFor> is
 *    intentionally NOT matched to the input id, so getByLabel() does NOT work.
 *    We target the input by `[id="<label>"]`.
 *
 *  - Select / MultiSelect / AsyncSelect are antd v5 Selects. The dropdown is a
 *    body-level portal `.ant-select-dropdown` with `[role="option"]` items
 *    (class `.ant-select-item-option`). The trigger is `.ant-select-selector`.
 *
 *  - DatePicker is react-datepicker v6: an input we can type yyyy-MM-dd into.
 *
 *  - CheckBox / RadioOptions are custom: we click their visible label text.
 */
import { expect, Locator, Page } from '@playwright/test';

const toPage = (scope: Page | Locator): Page =>
  'page' in scope ? (scope as Locator).page() : (scope as Page);

const esc = (value: string) => value.replace(/"/g, '\\"');

/* ------------------------------------------------------------------ inputs */

/** A text/number/email/password/phone input located by its label text. */
export const inputByLabel = (scope: Page | Locator, label: string): Locator =>
  scope.locator(`[id="${esc(label)}"]`);

/** Fill a plain text-like field. `scope` can be a row locator for repeats. */
export async function fillField(
  scope: Page | Locator,
  label: string,
  value: string,
  index = 0,
): Promise<void> {
  const input = inputByLabel(scope, label).nth(index);
  await input.click();
  await input.fill('');
  await input.fill(value);
}

/* ------------------------------------------------------------- antd select */

/** The antd `.ant-select` control belonging to a labeled field. */
export function antdSelect(scope: Page | Locator, label: string): Locator {
  return scope
    .locator('div')
    .filter({ has: scope.locator(`label:text-is("${esc(label)}")`) })
    .filter({ has: scope.locator('.ant-select') })
    .last()
    .locator('.ant-select')
    .first();
}

/** The currently-open antd dropdown (portal at body level). */
const openDropdown = (page: Page): Locator =>
  page.locator('.ant-select-dropdown:not(.ant-select-dropdown-hidden)');

/** Open a select, type to filter (async selects), and pick an option by text. */
export async function selectOption(
  scope: Page | Locator,
  label: string,
  optionText: string,
): Promise<void> {
  const page = toPage(scope);
  const select = antdSelect(scope, label);
  await select.locator('.ant-select-selector').click();
  // Searchable selects focus a search input on open; type to filter.
  await page.keyboard.type(optionText).catch(() => undefined);
  const option = openDropdown(page).locator('.ant-select-item-option', { hasText: optionText });
  await option.first().click();
}

/** Open a select and pick the FIRST available option (text unknown). */
export async function selectFirstOption(scope: Page | Locator, label: string): Promise<string> {
  const page = toPage(scope);
  const select = antdSelect(scope, label);
  await select.locator('.ant-select-selector').click();
  const first = openDropdown(page).locator('.ant-select-item-option').first();
  await first.waitFor({ state: 'visible', timeout: 15_000 });
  const text = (await first.textContent())?.trim() || '';
  await first.click();
  return text;
}

/** Pick several options in an antd multi-select, then close it. */
export async function selectMultiOptions(
  scope: Page | Locator,
  label: string,
  optionTexts: string[],
): Promise<void> {
  const page = toPage(scope);
  const select = antdSelect(scope, label);
  await select.locator('.ant-select-selector').click();
  for (const text of optionTexts) {
    await openDropdown(page).locator('.ant-select-item-option', { hasText: text }).first().click();
  }
  await page.keyboard.press('Escape');
}

/** Type a query into an async select and pick the first loaded result. */
export async function searchAndPickFirst(
  scope: Page | Locator,
  label: string,
  query: string,
): Promise<string> {
  const page = toPage(scope);
  const select = antdSelect(scope, label);
  await select.locator('.ant-select-selector').click();
  await page.keyboard.type(query);
  const first = openDropdown(page).locator('.ant-select-item-option').first();
  await first.waitFor({ state: 'visible', timeout: 20_000 });
  const text = (await first.textContent())?.trim() || '';
  await first.click();
  return text;
}

/* ----------------------------------------------------------------- date */

/**
 * Set a react-datepicker date field. Types yyyy-MM-dd when the input is
 * editable; otherwise opens the calendar and clicks an enabled day.
 */
export async function pickDate(
  scope: Page | Locator,
  label: string,
  isoDate: string,
  index = 0,
): Promise<void> {
  const page = toPage(scope);
  const input = inputByLabel(scope, label).nth(index);
  await input.click();
  const editable = await input
    .evaluate((el) => !(el as HTMLInputElement).readOnly)
    .catch(() => false);
  if (editable) {
    await input.fill(isoDate);
    await page.keyboard.press('Enter');
    await page.keyboard.press('Escape').catch(() => undefined);
    return;
  }
  // Read-only input: pick an enabled day from the open calendar.
  const day = page
    .locator(
      '.react-datepicker__day:not(.react-datepicker__day--disabled):not(.react-datepicker__day--outside-month)',
    )
    .last();
  await day.waitFor({ state: 'visible', timeout: 10_000 });
  await day.click();
}

/** Pick the first available time from a TimePicker's inline time list. */
export async function pickTime(scope: Page | Locator, label = 'Laikas', index = 0): Promise<void> {
  const page = toPage(scope);
  await inputByLabel(scope, label).nth(index).click();
  const slot = page
    .locator('.react-datepicker__time-list-item:not(.react-datepicker__time-list-item--disabled)')
    .first();
  await slot.waitFor({ state: 'visible', timeout: 10_000 });
  await slot.click();
}

/* --------------------------------------------------------- checkbox / radio */

/** Toggle a CheckBox identified by its visible label text. */
export async function toggleCheckBox(
  scope: Page | Locator,
  label: string,
  index = 0,
): Promise<void> {
  const page = toPage(scope);
  await page.getByText(label, { exact: false }).nth(index).click();
}

/** Choose a RadioOptions value by its visible option text. */
export async function chooseRadio(scope: Page | Locator, optionText: string): Promise<void> {
  const page = toPage(scope);
  await page.getByText(optionText, { exact: true }).first().click();
}

/* ---------------------------------------------------------------- buttons */

export function button(scope: Page | Locator, name: string, exact = true): Locator {
  return scope.getByRole('button', { name, exact });
}

export async function clickButton(
  scope: Page | Locator,
  name: string,
  exact = true,
): Promise<void> {
  await button(scope, name, exact).click();
}

/* ----------------------------------------------------------- assertions */

/** Assert a per-field validation error message is shown somewhere on the page. */
export async function expectError(scope: Page | Locator, message: string): Promise<void> {
  await expect(toPage(scope).getByText(message).first()).toBeVisible();
}
