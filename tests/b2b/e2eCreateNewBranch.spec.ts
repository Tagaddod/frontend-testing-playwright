import { test, expect } from "@playwright/test";
import { PoManager } from "../../src/core/PoManager";
import { getB2bTestData, randomBranchName, testdata } from "../../src/utils/testdata";

test.describe("B2B create new branch", { tag: ["@b2b", "@e2e"] }, () => {
  let po: PoManager;

  test.beforeEach(async ({ page }) => {
    po = new PoManager(page);
    await po.getB2BHomePage().open();
    await expect(page).not.toHaveURL(/\/auth/);
  });

  test("Create new branch", async () => {
    await po.completeB2BCreateNewBranchFlow(getB2bTestData());
  });

  test("should show error when phone number is invalid", async ({ page }) => {
    const form = po.getNewClientForm();

    await form.completeB2BBBranchWizard(randomBranchName());
    await form.fillBranchDetailsForm({
      phone: "",
      address: testdata.b2b.address,
    });
    await form.clickAddBranchBTN();

    await expect(form.phoneErrorMessage).toHaveText(
      testdata.b2b.errors.phoneRequired
    );
    await expect(page.getByRole("button", { name: "إضافة فرع" })).toBeVisible();
  });

  test("should show error when phone number already exists", async ({ page }) => {
    const form = po.getNewClientForm();
    const phone = testdata.phones.validUser;

    await form.completeB2BCreateNewBranchFlow({
      branchName: randomBranchName(),
      phone,
      address: testdata.b2b.address,
    });

    await po.getB2BHomePage().open();
    await form.completeB2BBBranchWizard(randomBranchName());
    await form.fillBranchDetailsForm({ phone, address: testdata.b2b.address });
    await form.clickAddBranchBTN();

    await expect(form.phoneErrorMessage).toHaveText(
      testdata.b2b.errors.phoneAlreadyExists
    );
  });

  test("should show error when branch name already exists", async ({ page }) => {
    const b2b = po.getB2BHomePage();

    await b2b.ClickCreateNewBranchButton();
    await b2b.branchNameInput.fill(testdata.b2b.existingBranchName);
    await b2b.clickNextButton();

    await expect(b2b.clientNameErrorMessage).toHaveText(
      testdata.b2b.errors.nameAlreadyExists
    );
  });
});
