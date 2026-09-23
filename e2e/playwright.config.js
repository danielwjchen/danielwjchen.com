const path = require('path');
const { defineConfig } = require('@playwright/test');

// The site under test. Defaults to the local dev server (`npm run develop`,
// port 8080). Set BASE_URL to point at another target — most importantly
// https://danielwjchen.com, which is used to (re)capture the production
// visual baselines (`npm run baseline:prod`).
const baseURL = process.env.BASE_URL || 'http://127.0.0.1:8080';
// Only auto-start the dev server when the target is the local one. When
// BASE_URL points elsewhere (e.g. production) nothing is started.
const isLocalTarget = /^https?:\/\/(127\.0\.0\.1|localhost)(:\d+)?\/?$/.test(baseURL);
const repoRoot = path.resolve(__dirname, '..');

module.exports = defineConfig({
  testDir: './tests',
  outputDir: path.join(__dirname, 'test-results'),
  reporter: [
    ['list'],
    ['html', { outputFolder: path.join(__dirname, 'playwright-report'), open: 'never' }],
  ],
  use: {
    baseURL,
    trace: 'retain-on-failure', // DOM/network/console replay on failure
    screenshot: 'only-on-failure',
    video: 'off',
  },
  expect: {
    toHaveScreenshot: {
      animations: 'disabled', // freeze CSS transitions/animations
      // Fraction of differing pixels allowed before a test fails. Sized for
      // the one known, understood drift: the home hero background. Production
      // currently serves a stale build whose .bg-landing declares
      // `background-position: cover` (an invalid value, so the image renders
      // at natural size) while this repo's build declares `background-size:
      // cover` — a ~3.8% zoom difference in that one hero, which measures
      // 13201 px ≈ 0.95% of the full mobile page. 2% gives ~2x headroom over
      // it (and room for font-rasterization differences across machines)
      // while any real regression — which cascades through a full-page
      // screenshot as shifted layout — lands orders of magnitude higher.
      // Re-tighten (e.g. 0.001) after production is redeployed from this
      // branch and the baselines are re-captured. Override with
      // MAX_DIFF_PIXEL_RATIO when investigating a failure.
      // (fullPage and mask are per-call options, not config keys.)
      maxDiffPixelRatio:
        process.env.MAX_DIFF_PIXEL_RATIO !== undefined
          ? parseFloat(process.env.MAX_DIFF_PIXEL_RATIO)
          : 0.02,
    },
  },
  webServer: isLocalTarget
    ? {
        command: 'bash e2e/start-dev-server.sh',
        cwd: repoRoot,
        url: 'http://127.0.0.1:8080',
        reuseExistingServer: !process.env.CI,
        timeout: 180 * 1000, // first webpack compile is slow
      }
    : undefined,
  projects: [
    { name: 'desktop', use: { viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 } },
    { name: 'mobile', use: { viewport: { width: 375, height: 667 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1 } },
  ],
});
