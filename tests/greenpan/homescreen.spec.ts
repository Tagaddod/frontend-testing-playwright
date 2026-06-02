import { test, expect } from "../../src/fixtures/loginFixture";
import { PoManager } from "../../src/core/PoManager";
import testdata from "../../src/utils/testdata.json";

test.describe("GreenPan User Flow Tests", { tag: ["@greenpan", "@e2e"] }, () => {
  let po: PoManager;
  test.beforeEach(async ({ page }) => {
    po = new PoManager(page);
    await po.getGreenpanHome().open();
    await expect(page).toHaveURL(/greenpan/);
    await expect(po.getGreenpanHome().dashboardText()).toBeVisible();
  });

  test("Open GreenPan with valid user phone number", async () => {
    
    await po.getGreenpanHome().EnterPhoneNumber(testdata.phones.validNewUser);
    await expect(po.getGreenpanHome().textQuestion()).toBeVisible();
  });

  
  test("Open GreenPan with invalid user phone number", async () => {
    await po.getGreenpanHome().EnterPhoneNumber(testdata.phones.invalidUser);
    await expect(po.getGreenpanHome().errorMsgPhoneNumber()).toBeVisible();
  });


  test("Verify user is redirected to bundle details page after clicking on bundle package", async () => {
   
    await po.getGreenpanHome().openPackageCard();
    await expect(po.getGreenpanHome().bundlePackageMsg()).toBeVisible();
  });


  test("Verify system accepts valid phone number in bundle details page", async () => {
    
    await po.getGreenpanHome().openPackageCard();
    await po.getGreenpanHome().EnterPhoneNumberFromBundlePackage(testdata.phones.validUser);
    await expect(po.getGreenpanHome().textQuestion()).toBeVisible();
  });

});