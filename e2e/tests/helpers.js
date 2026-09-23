// Shared helpers for the visual-regression specs.

// Collects 4xx/5xx sub-resource responses so broken assets surface as an
// explicit, readable warning instead of a silent pixel diff.
//
// Only the site's OWN (same-origin) sub-resources are flagged: third-party
// scripts (analytics, fonts) that 404 are not design regressions. The dead
// `/dist/<page>.css` <link> is also excluded — with style-loader the CSS ships
// inside the JS bundle, so that stylesheet always 404s on both dev and prod.
//
// NOTE: the production host does not serve the raw content folders
// (/projects/*, /blogs/*), so their images 404 there even though they exist in
// the repo. These are reported (below) but do not fail the test, so the same
// specs can capture production baselines.
function trackBadResponses(page) {
  const bad = [];
  let origin = null;
  page.on('framenavigated', (frame) => {
    if (frame === page.mainFrame()) {
      try {
        origin = new URL(frame.url()).origin;
      } catch (e) {
        /* non-http navigation; ignore */
      }
    }
  });
  page.on('response', (response) => {
    if (response.status() < 400) return;
    let url;
    try {
      url = new URL(response.url());
    } catch (e) {
      return;
    }
    if (origin && url.origin !== origin) return; // only same-origin sub-resources
    if (/\/dist\/[^/]+\.css$/.test(url.pathname)) return; // style-loader quirk
    bad.push(`${response.status()} ${response.url()}`);
  });
  return bad;
}

// Surfaces collected broken assets as a test annotation (visible in the HTML
// report) and a console warning, without failing the test.
function reportBrokenAssets(badResponses) {
  if (!badResponses || badResponses.length === 0) return;
  const message = `same-origin asset issues: ${badResponses.join(', ')}`;
  console.warn('  [assets] ' + message);
  try {
    require('@playwright/test').test
      .info()
      .annotations.push({ type: 'broken-assets', description: message });
  } catch (e) {
    /* outside a test run; console warning is enough */
  }
}

// Waits until the page is fully rendered before a screenshot is taken:
// web fonts loaded (production loads a Google font link), every <img>
// finished loading, and a short settle so style-loader-injected CSS and
// final layout are stable.
async function waitForRender(page) {
  await page.evaluate(() => document.fonts.ready);
  await page
    .waitForFunction(() => Array.from(document.images).every((img) => img.complete), {
      timeout: 20000,
    })
    .catch(() => {}); // a hung image is reported by the bad-response collector
  await page.waitForTimeout(100);
}

// Regions excluded from the pixel comparison. `<img>` elements are masked as
// a second line of defense: even with the aborted requests below, any image
// area (including ones that load fine on both sides) is excluded so the test
// compares layout, text, and styling, not image content.
function imageMask(page) {
  return [page.locator('img')];
}

// Production does not serve the raw content folders (/projects/*, /blogs/*),
// so their images 404 there even though the files exist in the repo. A broken
// <img> with a width but no height collapses to a different box than a loaded
// one, which shifts the surrounding layout and defeats pixel comparison.
// These requests are therefore aborted on EVERY run (dev and prod alike) so
// both sides render the same broken-image state and the comparison covers
// layout, text, and styling. Each abort is recorded so the missing files
// still surface in the broken-assets report.
const missingInProdPatterns = [
  '**/projects/*/images/**',
  '**/blogs/*/images/**',
];

async function normalizeMissingImages(page, badResponses) {
  for (const pattern of missingInProdPatterns) {
    await page.route(pattern, (route) => {
      badResponses.push(`missing-in-prod ${route.request().url()}`);
      route.abort();
    });
  }
}

module.exports = {
  trackBadResponses,
  normalizeMissingImages,
  reportBrokenAssets,
  waitForRender,
  imageMask,
};
