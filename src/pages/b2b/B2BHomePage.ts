import { expect, Locator, Page } from "@playwright/test";
import { URLs } from "../../config/urls";

/**
 * Branch selection step on B2B "تسجيل طلب بيزنس" — combobox search, not a plain Search input.
 */
export class B2BHomePage {
  readonly branchCombobox: Locator;
  readonly nxtButton: Locator;
  readonly createNewBranchBTN: Locator;
  readonly branchNameInput:Locator;
  readonly searchBranch:Locator;
  readonly AddNewClientBTN:Locator;
    readonly EnglishInputName:Locator;
    readonly businessType:Locator;
    readonly clientNameErrorMessage: Locator;

    constructor(private page: Page) {
    this.branchCombobox = page
      .locator(".ant-form-item")
      .filter({ hasText: "الفرع" })
      .first()
      .getByRole("combobox");
    this.nxtButton = page.locator('[tag-test-id="business-client-form-submit-button"]');
    this.createNewBranchBTN=page.getByRole('button', { name: 'إضافة فرع جديد' });
    this.branchNameInput=page.getByPlaceholder('ابحث بإسم البيزنس');
    this.AddNewClientBTN=page.locator('span:has-text("إضافة عميل جديد")');
    this.EnglishInputName=page.locator('#nameEN');
    this.businessType=page.locator('#brandTypeId');
    this.clientNameErrorMessage=page.locator('.ant-form-item:has(#nameAR) .ant-form-item-explain-error');
  }

  async open() {
    await this.page.goto(URLs.b2b.base, { waitUntil: "domcontentloaded" });
  }

  /** Opens the branch combobox (search). */
  async clickSearch() {
    await this.branchCombobox.click();
  }

  async selectBranch(branchName: string) {
    await this.clickSearch();

  await this.branchCombobox.fill(branchName);

  const firstOption = this.page
    .locator(".ant-select-dropdown")
    .last()
    .locator(".ant-select-item-option")
    .first();

  await expect(firstOption).toBeVisible();
  await firstOption.click();
  await this.page.locator('[tag-test-id="existing_branch__proceed_button"]').click();
  }

  async selectBusiness(businessName: string) {
    await this.page.locator("#nameAR").fill(businessName);
    const option = this.page
      .locator("div.ant-select-dropdown")
      .last()
      .locator(".ant-select-item-option, [role='option']")
      .filter({ hasText: businessName })
      .first();
    await option.waitFor({ state: "attached", timeout: 15_000 });
    await option.click({ force: true });
  }

  async clickNextButton() {
  const formNext = this.page.locator('[tag-test-id="business-client-form-submit-button"]');
  await expect(formNext).toBeEnabled({ timeout: 15_000 });
  await formNext.click();
  }
  

  async ClickCreateNewBranchButton() {
    await this.createNewBranchBTN.click();
    await expect(this.branchNameInput).toBeVisible({ timeout: 15_000 });
  }
  async AddNewCleint(branchName: string) {
    await this.branchNameInput.fill(branchName);
    await this.AddNewClientBTN.click();
  }
  async fillEnglishInputName(englishName:string){
    await this.EnglishInputName.fill(englishName);
  }
  async selectBusinessType(businessType = "فندق") {
    await this.businessType.click();
    const option = this.page
      .locator("div.ant-select-dropdown")
      .last()
      .locator(".ant-select-item-option, [role='option']")
      .filter({ hasText: businessType })
      .first();
    try {
      await option.waitFor({ state: "attached", timeout: 15_000 });
      await option.click({ force: true });
    } catch (err) {
      if (this.page.isClosed()) throw err;
      await this.businessType.focus();
      await this.page.keyboard.press("ArrowDown");
      await this.page.keyboard.press("Enter");
    }
  }

}
export { B2BHomePage as B2BHomePage };
