import type { Page } from "@playwright/test";

const CAL_EMBED_SCRIPT_URL = "https://app.cal.com/embed/embed.js**";
const GOOGLE_MAPS_URL = "https://www.google.com/maps**";

const CAL_EMBED_SCRIPT = `
  (() => {
    const mount = () => {
      const container = document.querySelector('#my-cal-inline-30-minute-discovery-call');
      if (!container) {
        window.setTimeout(mount, 10);
        return;
      }

      const iframe = document.createElement('iframe');
      iframe.title = 'Cal.com discovery call booking';
      iframe.style.width = '100%';
      iframe.style.height = '360px';
      iframe.style.border = '0';
      iframe.style.borderRadius = '20px';
      iframe.srcdoc = '<!doctype html><html><body style="margin:0;padding:24px;font-family:Arial,sans-serif;background:#f4f8f6;color:#0f4743"><h1 style="font-size:20px">30-minute discovery call</h1><p>Select a time</p><button>9:00am</button><button>10:30am</button></body></html>';
      container.replaceChildren(iframe);
    };

    mount();
  })();
`;

export async function mockExternalProviders(page: Page): Promise<void> {
  await page.route(CAL_EMBED_SCRIPT_URL, (route) =>
    route.fulfill({
      contentType: "application/javascript",
      body: CAL_EMBED_SCRIPT,
    }),
  );

  await page.route(GOOGLE_MAPS_URL, (route) =>
    route.fulfill({
      contentType: "text/html",
      body: "<!doctype html><html><body>Map provider placeholder</body></html>",
    }),
  );
}
