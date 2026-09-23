const { test, expect } = require('@playwright/test');
const { trackBadResponses, normalizeMissingImages, reportBrokenAssets, waitForRender, imageMask } = require('./helpers');

test.describe('Portfolio', () => {
  test('matches the production baseline', async ({ page }) => {
    const badResponses = trackBadResponses(page);
    await normalizeMissingImages(page, badResponses);

    await page.goto('/portfolio/');
    await expect(page).toHaveTitle('Portfolio - DanielWJChen.com');
    // Both published projects are present.
    await expect(page.getByRole('heading', { name: 'drunkspiration.us' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'medicr.us' })).toBeVisible();
    await waitForRender(page);

    reportBrokenAssets(badResponses);

    await expect(page).toHaveScreenshot('portfolio.png', { fullPage: true, mask: imageMask(page) });
  });
});
