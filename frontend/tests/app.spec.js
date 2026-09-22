import { test, expect } from '@playwright/test';

test('builds a distinct two-person hug and preserves it in the link', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('img', { name: '2 people hugging' })).toBeVisible();
  await page.getByRole('article', { name: 'Person 1' }).getByRole('button', { name: 'Person' }).click();
  await page.getByRole('article', { name: 'Person 1' }).getByRole('button', { name: 'Dark', exact: true }).click();
  await expect(page).toHaveURL(/p1=25/);
  await page.reload();
  await expect(page.getByRole('article', { name: 'Person 1' }).getByRole('button', { name: 'Person' })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('article', { name: 'Person 1' }).getByRole('button', { name: 'Dark', exact: true })).toHaveAttribute('aria-pressed', 'true');
});

test('supports self hugs and four-person hugs', async ({ page }) => {
  await page.goto('/?n=1&p1=35');
  await expect(page.getByRole('img', { name: 'One person giving themselves a hug' })).toBeVisible();
  await expect(page.getByText('A hug for yourself')).toBeVisible();
  await page.getByRole('button', { name: 'Add one person' }).click();
  await page.getByRole('button', { name: 'Add one person' }).click();
  await page.getByRole('button', { name: 'Add one person' }).click();
  await expect(page.getByRole('img', { name: '4 people hugging' })).toBeVisible();
  await expect(page.getByRole('article')).toHaveCount(4);
  await expect(page.getByRole('button', { name: 'Add one person' })).toBeDisabled();
});

test('exports SVG and remains usable on a phone', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.locator('body')).toHaveJSProperty('scrollWidth', 390);
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download SVG' }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('my-hug-2-people.svg');
});

test('shares the exact current hug URL through the native share sheet', async ({ page }) => {
  await page.addInitScript(() => {
    window.sharedHug = null;
    navigator.share = async data => { window.sharedHug = data; };
  });
  await page.goto('/?n=1&p1=25');
  await page.getByRole('button', { name: 'Share this hug' }).click();
  expect(await page.evaluate(() => window.sharedHug)).toMatchObject({
    title: 'I made myself a hug',
    url: 'http://127.0.0.1:4173/?n=1&p1=25',
  });
});
