const { test, expect } = require('@playwright/test');
const { trackBadResponses, normalizeMissingImages, reportBrokenAssets, waitForRender, imageMask } = require('./helpers');

test.describe('Home', () => {
  test('matches the production baseline', async ({ page }) => {
    const badResponses = trackBadResponses(page);
    await normalizeMissingImages(page, badResponses);

    await page.goto('/');
    await expect(page).toHaveTitle('Home - DanielWJChen.com');
    await expect(page.getByRole('heading', { name: "Hi, I'm Daniel!" })).toBeVisible();
    await waitForRender(page);

    reportBrokenAssets(badResponses);

    await expect(page).toHaveScreenshot('home.png', { fullPage: true, mask: imageMask(page) });
  });
});
