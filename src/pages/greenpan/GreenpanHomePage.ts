
import { expect, Locator, Page } from "@playwright/test";
import { URLs } from "../../config/urls";

export class GreenpanHomePage {
  readonly phoneInput: Locator;
  readonly submitButton: Locator;
  readonly quantityInput: Locator;
  readonly addGiftButton:Locator;
  readonly nextButton: Locator;
  readonly Card : Locator;
  readonly PhoneInputFromBundle:Locator;
  readonly ChooseGiftBTN:Locator;
  readonly plusButton:Locator;
  constructor(private page: Page) {
    this.phoneInput = page.locator("#phoneForm-phone");
    this.submitButton = page.getByRole("button", {name: "ابدأ الطلب",});
    this.quantityInput = page.locator("#quantityForm-quantity");
    this.addGiftButton=page.getByRole('button', { name: 'اضف الهدية' });
    this.nextButton=page.getByRole('button', { name: 'التالي' });
    this.Card= page.locator("h3:has-text('باقة نظافة وتوفير')").locator("..").locator("..");
    this.PhoneInputFromBundle=page.locator("#GiftCarouselBottomSheetPhoneForm-phone");
    this.ChooseGiftBTN=page.getByText('اختار هديتك');
    this.plusButton = page.locator("button:has(use[href*='#plus'])");
    // النقاط المتبقية
   }
  async open() {
    await this.page.goto(URLs.greenpan.base, { waitUntil: "domcontentloaded" });
  }
  dashboardText(): Locator {
    return this.page.getByText("بدلي الزيت المستعمل بهدايا");
  }
  textQuestion(): Locator {
    return this.page.getByText('معاك كام كيلو ؟');
  }
  textRewards():Locator{
    return this.page.getByText(/هتكسب.*نقط تبدلهم بهدايا/);
}
 errorMsgPhoneNumber() : Locator{
  return this.page.locator("#phoneForm-phone-error");
}
bundlePackageMsg():Locator{
 return this.page.locator('h2', {
  hasText: 'دخل رقم تليفونك واحصل على الهديه'});
 }
 ChooseGiftText() : Locator{
  return this.page.getByRole('heading', { 
    name: 'اختار هديتك' 
 })};

 DisabledAddGiftButton():Locator{
  return this.page.locator("button:has-text('نقاطك لا تكفي')");
 }
  
 async getInsufficientPointsButtonForGift(index: number) {
  const allLockButtons = this.page.locator("button:has-text('نقاطك لا تكفي')");

  // اختار الزرار اللي مرتب بالهدية حسب ترتيبها بعد Add Gift
  return allLockButtons.nth(index);
 }

  async EnterPhoneNumber(phone : string){
    await this.phoneInput.fill(phone);
    await this.submitButton.click();}

  async EnterQuantity(quantity: number) {await this.quantityInput.fill(quantity.toString());}

  async AddGift(index : number){await this.addGiftButton.nth(index).click();}

  async NextStep(){await this.nextButton.click();}
 
  async openPackageCard(){ await this.Card.click()}
 
  async EnterPhoneNumberFromBundlePackage(phone:string){
    await this.PhoneInputFromBundle.fill(phone);
    await this.ChooseGiftBTN.click();
  }
  async increaseGiftQuantity(count: number = 1) {
    for (let i = 0; i < count; i++) {
      const freshPlusButton = this.page.locator("button:has(svg use[href*='#plus'])");
  
      if (await freshPlusButton.isEnabled()) {
        await freshPlusButton.click();
        await this.page.waitForTimeout(150); 
      } else {
        break; 
      }
    }
  }
  async getRemainingPoints(): Promise<number> {
    const text = await this.page
  .locator('div:has-text("نقاط متبقية") .tabular-nums span[style*="transform: none"]')
  .first()
  .textContent();
      console.log(text);  
    return Number(text?.replace(/,/g, "").trim());
  }
  
}
