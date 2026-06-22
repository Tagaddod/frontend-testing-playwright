import { test, expect } from "@playwright/test";
import { B2XHomePage } from "../../src/pages/B2X/B2XHomePage";

test.describe("B2X home", () => {
  let home: B2XHomePage;

  test.beforeEach(async ({ page }) => {
    home = new B2XHomePage(page);
    await home.open();
    await expect(page).not.toHaveURL(/\/auth/);
  });

  test("opens B2X trader search page", { tag: ["@b2x", "@smoke", "@e2e"] }, async () => {
    await expect(home.searchTraderInput).toBeVisible();
    await expect(home.addNewTraderBTN).toBeVisible();
  });
});
