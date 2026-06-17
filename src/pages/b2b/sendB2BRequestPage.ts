import { Locator, Page } from "@playwright/test";

export class sendB2BRequestPage {
  readonly createRequestButton: Locator;
  readonly addCollactableButton : Locator;
  readonly deleteCollactableButton:Locator;
  readonly increaseQuantityButton:Locator;
  readonly reduceQuantityButton:Locator;
  readonly nextBTN:Locator;


  constructor(private page: Page) {
    this.createRequestButton = page.getByText("عمل طلب جديد");
    this.addCollactableButton=page.getByLabel("إضافة زيت مستعمل");
    this.deleteCollactableButton=page.getByText('حذف');
    this.increaseQuantityButton=page.locator('[aria-label="زيادة عدد زيت مستعمل"]');
    this.reduceQuantityButton=page.locator('[aria-label="تقليل عدد زيت مستعمل"]');
    this.nextBTN = page.getByRole("button", { name: "التالي" }).last();
  }

  async clickCreateRequestButton() {
    await this.createRequestButton.click();
  }

  async ClickAddCollactableButton(){
    await this.addCollactableButton.click();
  }
  async increaseQuantity(times: number) {
    for (let i = 0; i < times; i++) {
      await this.increaseQuantityButton.click();
    }
  }

  async ClickReduceQuantityButton(times: number) {
    for (let i = 0; i < times; i++) {
      await this.reduceQuantityButton.click();
    }
  }

  async ClickDeleteCollactableButton() {
    await this.deleteCollactableButton.click();
  }
  async clickNextButton(){
    await this.nextBTN.click();
  }


  async CreateRequestFlow(){
    //await this.clickCreateRequestButton();
    await this.ClickAddCollactableButton();
    await this.increaseQuantity(2);
    await this.clickNextButton();

  }
}
