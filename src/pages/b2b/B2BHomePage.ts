import { expect, Locator, Page } from "@playwright/test";
import { URLs } from "../../config/urls";

/**
 * Branch selection step on B2B "تسجيل طلب بيزنس" — combobox search, not a plain Search input.
 */
export class sendRequestPage {
  readonly branchCombobox: Locator;
  readonly nxtButton: Locator;
  readonly createNewBranchBTN: Locator;
  readonly branchNameInput:Locator;
  readonly AddNewClientBTN:Locator;
    readonly EnglishInputName:Locator;
    readonly businessType:Locator;
    readonly clientNameErrorMessage: Locator;

    constructor(private page: Page) {
    this.branchCombobox = page.getByRole("combobox").first();
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

  async enterBranchName(branchName: string) {
    await this.branchCombobox.click();
    await this.branchCombobox.fill(branchName);

    // Last portaled dropdown is the open one; first row inside it.
    const firstRow = this.page
      .locator("div.ant-select-dropdown")
      .last()
      .locator(".ant-select-item-option, [role='option']")
      .first();

    try {
      await firstRow.waitFor({ state: "visible", timeout: 20_000 });
      await firstRow.click();
    } catch (err) {
      if (this.page.isClosed()) throw err;
      await this.branchCombobox.focus();
      await this.page.keyboard.press("ArrowDown");
      await this.page.keyboard.press("Enter");
    }
  }

  async selectBranch(branchName: string) {
    await this.clickSearch();
    await this.enterBranchName(branchName);
  }

  async clickNextButton() {
    const formNext = this.page.locator('[tag-test-id="business-client-form-submit-button"]');
    const branchNext = this.page.getByLabel("التالي");
    const next = (await formNext.isVisible()) ? formNext : branchNext;
    await expect(next).toBeEnabled({ timeout: 15_000 });
    await next.click();
  }

  async ClickCreateNewBranchButton() {
    await this.createNewBranchBTN.click();
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

/** Alias for specs and PO naming — same class as {@link sendRequestPage}. */
export { sendRequestPage as B2BHomePage };

