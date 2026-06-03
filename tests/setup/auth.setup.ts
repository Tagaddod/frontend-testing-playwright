import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { test as setup } from "../../src/fixtures/loginFixture";
import { URLs } from "../../src/config/urls";

const AUTH_STATE_PATH = "playwright/.auth/user.json";
/**
 * Runs once before B2B tests: token login → save cookies/localStorage for reuse.
 */
setup("authenticate B2B and save storage state", async ({ page, token }) => {
  mkdirSync(dirname(AUTH_STATE_PATH), { recursive: true });

  await page.goto(`${URLs.b2b.auth}${token}`, { waitUntil: "domcontentloaded" });

  await page.waitForURL((url) => !url.href.includes("/auth?token="), {
    timeout: 60_000,
  });

  await page.context().storageState({ path: AUTH_STATE_PATH });
});
