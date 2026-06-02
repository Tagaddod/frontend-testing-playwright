import { test, expect } from "../../src/fixtures/loginFixture";
import { PoManager } from "../../src/core/PoManager";
import testdata from "../../src/utils/testdata.json";

test.describe("Greenpan Quantity Validation", { tag: ["@greenpan", "@e2e"] }, () => {
  let po: PoManager;

    test.beforeEach(async ({ page }) => {
      po = new PoManager(page);
      await po.getGreenpanHome().open();
      await expect(page).toHaveURL(/greenpan/);
      await po.getGreenpanHome().EnterPhoneNumber(testdata.phones.validUser);
    });
  
    test("Verify system does not accept quantity less than minimum required (2 KG)", async () => {
  
      await po.getGreenpanHome().EnterQuantity(testdata.quantities.small);
  
      await expect(po.getGreenpanHome().ChooseGiftText()).not.toBeVisible();

    });
  
    test("Verify system accepts quantity equal or greater than minimum required (2 KG)", async () => {
  
      await po.getGreenpanHome().EnterQuantity(testdata.quantities.medium);
      const enteredQuantity = Number(await po.getGreenpanHome().quantityInput.inputValue());
      await expect(po.getGreenpanHome().ChooseGiftText()).toBeVisible();

      const remaining = await po.getGreenpanHome().getRemainingPoints();
      console.log(remaining);
      console.log(enteredQuantity);
      expect(remaining).toBe(enteredQuantity);
    });

    test("Verify system deducts quantity from remaining points", async () => {
    
        await po.getGreenpanHome().EnterQuantity(testdata.quantities.large);
        const enteredQuantity = Number(await po.getGreenpanHome().quantityInput.inputValue());
        await po.getGreenpanHome().AddGift(0);
        const remaining = await po.getGreenpanHome().getRemainingPoints();
        expect(remaining).toBeLessThan(enteredQuantity);
      });

      test("Verify Add Gift button becomes disabled when remaining points reach zero", async ({ page }) => {

        await po.getGreenpanHome().EnterQuantity(6);      
        await po.getGreenpanHome().AddGift(3);      
        await po.getGreenpanHome().increaseGiftQuantity(3);   
        const lockButton = await po.getGreenpanHome().getInsufficientPointsButtonForGift(2);
        await expect(lockButton).toBeVisible();
        await expect(lockButton).toBeDisabled();
        
      });

      
  });
  



