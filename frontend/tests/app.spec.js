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

for (const count of [1, 2, 3, 4]) {
  test(`renders a downloadable PNG for ${count} ${count === 1 ? 'person' : 'people'}`, async ({ page }) => {
    await page.goto(`/?n=${count}&p1=25&p2=01&p3=14&p4=00`);
    const pending = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Download PNG' }).click();
    const download = await pending;
    expect(download.suggestedFilename()).toBe(`my-hug-${count}-people.png`);
    const stream = await download.createReadStream();
    const chunks = [];
    for await (const chunk of stream) chunks.push(chunk);
    const bytes = Buffer.concat(chunks);
    expect(bytes.subarray(0, 8)).toEqual(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
    expect(bytes.readUInt32BE(16)).toBe(1800);
    expect(bytes.readUInt32BE(20)).toBe(1120);
    const hasPeople = await page.evaluate(async base64 => {
      const img = new Image();
      img.src = `data:image/png;base64,${base64}`;
      await img.decode();
      const canvas = document.createElement('canvas');
      canvas.width = img.width; canvas.height = img.height;
      const context = canvas.getContext('2d');
      context.drawImage(img, 0, 0);
      const pixels = context.getImageData(500, 200, 800, 800).data;
      let darkPixels = 0;
      for (let offset = 0; offset < pixels.length; offset += 4) {
        if (pixels[offset] < 120 && pixels[offset + 1] < 120 && pixels[offset + 2] < 120 && pixels[offset + 3] > 200) darkPixels++;
      }
      return darkPixels > 1000;
    }, bytes.toString('base64'));
    expect(hasPeople, 'PNG contains the figures, not only the background').toBe(true);
  });
}
