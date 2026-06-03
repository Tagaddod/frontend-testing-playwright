import { test,expect } from "@playwright/test";
import { URLs } from "../../src/config/urls";
import { PoManager } from "../../src/core/PoManager";
import { getB2bTestData } from "../../src/utils/testdata";

test.describe("B2B create request", { tag: ["@b2b", "@e2e"] }, () => {
  let po:PoManager;
  test.beforeEach(async ({ page }) => {
    po = new PoManager(page);
    await po.getB2BHomePage().open();
    await expect(page).not.toHaveURL(/\/auth/);
  });

  test("create request for new branch", async({page}) => {
    const b2bData = getB2bTestData();
    await po.completeB2BCreateNewBranchFlow(b2bData);
     await po.getB2BHomePage().clickSearch();
     await po.getB2BHomePage().enterBranchName(b2bData.branchName);
     await po.getB2BHomePage().clickNextButton();
     await po.getSendB2BRequestPage().CreateRequestFlow();
     await po.getRequestDetails().ClickEnterDateButton();
     await po.getRequestDetails().selectPickupTime();
     await po.getRequestDetails().ClickSubmitButton();
  });


  
});
