const { test, expect } = require('@playwright/test');
const { trackBadResponses, normalizeMissingImages, reportBrokenAssets, waitForRender, imageMask } = require('./helpers');

test.describe('Blog', () => {
  test('catalog matches the production baseline', async ({ page }) => {
    const badResponses = trackBadResponses(page);
    await normalizeMissingImages(page, badResponses);

    await page.goto('/blog/');
    await expect(page).toHaveTitle('Blog - DanielWJChen.com');
    // The single published post is present in the catalog.
    await expect(
      page.getByRole('heading', { name: 'Upgrading Old AngularJS + GruntJS Project to Webpack' })
    ).toBeVisible();
    await waitForRender(page);

    reportBrokenAssets(badResponses);

    await expect(page).toHaveScreenshot('blog.png', { fullPage: true, mask: imageMask(page) });
  });
});
