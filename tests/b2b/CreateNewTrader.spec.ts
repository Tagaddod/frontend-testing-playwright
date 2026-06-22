import { test, expect } from "@playwright/test";
import { PoManager } from "../../src/core/PoManager";
import { getB2bTestData, randomBranchName, randomPhoneNumber, testdata } from "../../src/utils/testdata";

test.describe("B2B create new branch", () => {
  let po: PoManager;

  test.beforeEach(async ({ page }) => {
    po = new PoManager(page);
    await po.getB2BHomePage().open();
    await expect(page).not.toHaveURL(/\/auth/);
  });

  test("Create new Trader and branch with valid data", { tag: ["@b2b", "@smoke", "@regression", "@e2e"] }, async () => {
    await po.completeB2BCreateNewBranchFlow(getB2bTestData());
  });

  test("Create a new branch for trader already exists", { tag: ["@b2b", "@smoke", "@regression", "@e2e"] }, async ({ page }) => {
    const home = po.getB2BHomePage();
    const form = po.getNewClientForm();

    await home.ClickCreateNewBranchButton();
    await home.selectBusiness(testdata.b2b.existingBranchName);
    await home.clickNextButton();
    await expect(form.phoneInput).toBeVisible({ timeout: 30_000 });
    await form.fillBranchDetailsForm({
      phone: randomPhoneNumber(),
      address: testdata.b2b.address,
    });
    await form.clickAddBranchBTN({ waitForSuccess: true });
  });

  test("should show error when phone number is invalid", { tag: ["@b2b", "@regression"] }, async ({ page }) => {
    const form = po.getNewClientForm();
    await form.completeB2BBBranchWizard(randomBranchName());
    await form.fillBranchDetailsForm({
      phone: "",
      address: testdata.b2b.address,
    });
    await form.clickAddBranchBTN();
    await expect(form.phoneErrorMessage).toHaveText(testdata.b2b.errors.phoneRequired);
    await expect(page.getByRole("button", { name: "إضافة فرع" })).toBeVisible();
  });

  test("show error message when missing the country code on phone number", { tag: ["@b2b", "@regression"] }, async () => {
    const form = po.getNewClientForm();
    await form.completeB2BBBranchWizard(randomBranchName());
    await form.fillPhoneNumber(randomPhoneNumber());
    await form.clickAddBranchBTN();
    await expect(form.countryCodeErrorMessage).toHaveText(
      testdata.b2b.errors.countryCodeRequired
    );
  });

  test("show error message when missing the address", { tag: ["@b2b", "@regression"] }, async () => {
    const form = po.getNewClientForm();
    await form.completeB2BBBranchWizard(randomBranchName());
    await form.fillPhoneNumber(randomPhoneNumber());
    await form.fillCountryCode();
    await form.clickAddBranchBTN();
    await expect(form.addressErrorMessage).toHaveText(testdata.b2b.errors.addressRequired);
  });

  test("show error message when missing the collectables type", { tag: ["@b2b", "@regression"] }, async () => {
    const form = po.getNewClientForm();
    await form.completeB2BBBranchWizard(randomBranchName());
    await form.fillPhoneNumber(randomPhoneNumber());
    await form.fillCountryCode();
    await form.fillAdressLatandLong(testdata.b2b.address);
    await form.clickAddBranchBTN();
    await expect(form.collectablesTypeErrorMessage).toBeVisible();
  });

  test("show error message when missing the payment method", { tag: ["@b2b", "@regression"] }, async () => {
    const form = po.getNewClientForm();
    await form.completeB2BBBranchWizard(randomBranchName());
    await form.fillPhoneNumber(randomPhoneNumber());
    await form.fillCountryCode();
    await form.fillAdressLatandLong(testdata.b2b.address);
    await form.selectWasteType();
    await form.clickAddBranchBTN();
    await expect(form.paymentMethodErrorMessage).toHaveText(
      testdata.b2b.errors.paymentMethodRequired
    );
  });

  test("show error message when missing the photo", { tag: ["@b2b", "@regression"] }, async () => {
    const form = po.getNewClientForm();
    await form.completeB2BBBranchWizard(randomBranchName());
    await form.fillPhoneNumber(randomPhoneNumber());
    await form.fillCountryCode();
    await form.fillAdressLatandLong(testdata.b2b.address);
    await form.selectWasteType();
    await form.selectPaymentMethod();
    await form.clickAddBranchBTN();
    await expect(form.photoErrorMessage).toHaveText(testdata.b2b.errors.photoRequired);
  });
});
