import { expect, Locator, Page } from "@playwright/test";
import { images } from "../../utils/images";
import { testdata } from "../../utils/testdata";
import { URLs } from "../../config/urls";
import { B2BHomePage } from "./B2BHomePage";

export type B2BNewBranchFlowData = {
  branchName: string;
  phone: string;
  address: string;
};

export class NewClientForm {
  readonly phoneInput: Locator;
  readonly countryCodeInput: Locator;
  readonly AdressInput: Locator;
  readonly paymentMethod: Locator;
  readonly preferredTime: Locator;
  readonly addBranchBTN: Locator;
  readonly preferredDay: Locator;
  readonly phoneErrorMessage: Locator;
  readonly countryCodeErrorMessage: Locator;
  readonly addressErrorMessage: Locator;
  readonly collectablesTypeErrorMessage: Locator;
  readonly paymentMethodErrorMessage: Locator;
  readonly photoErrorMessage: Locator;

  constructor(private page: Page) {
    this.phoneInput = page.locator("#primaryPhoneNumber");
    this.countryCodeInput = page.locator("#primaryCountryCode");
    this.AdressInput = page.locator("#address");
    this.paymentMethod = page.locator("#paymentMethod");
    this.preferredTime = page
      .locator(".ant-radio-button-wrapper")
      .filter({ hasText: "صباحاَ" });
    this.addBranchBTN = page.getByRole("button", { name: "إضافة فرع" });
    this.preferredDay = page.getByText("الاحد", { exact: true });
    this.phoneErrorMessage = page.locator(
      ".ant-form-item:has(#primaryPhoneNumber) .ant-form-item-explain-error"
    );
    this.countryCodeErrorMessage = page.locator(
      ".ant-form-item:has(#primaryCountryCode) .ant-form-item-explain-error"
    );
    this.addressErrorMessage = page.locator(
      ".ant-form-item:has(#address) .ant-form-item-explain-error"
    );
    this.collectablesTypeErrorMessage = page.getByText(
      testdata.b2b.errors.collectablesRequired
    );
    this.paymentMethodErrorMessage = page.locator(
      ".ant-form-item:has(#paymentMethod) .ant-form-item-explain-error"
    );
    this.photoErrorMessage = page.locator(
      ".ant-form-item:has(#bannerImage) .ant-form-item-explain-error"
    );
  }

  async fillPhoneNumber(phoneNumber: string) {
    await this.phoneInput.fill(phoneNumber);
  }

  async completeB2BBBranchWizard(branchName: string) {
    const b2b = new B2BHomePage(this.page);
    await b2b.ClickCreateNewBranchButton();
    await b2b.AddNewCleint(branchName);
    await b2b.fillEnglishInputName(branchName);
    await b2b.selectBusinessType();
    await b2b.clickNextButton();
    await expect(this.phoneInput).toBeVisible({ timeout: 30_000 });
  }

  getClientIdFromUrl() {
    return this.page.url().match(/\/client\/(\d+)/)?.[1];
  }

  async openNewBranchFormForClient(clientId: string) {
    await this.page.goto(`${URLs.b2b.base}/client/${clientId}/branch/new`, {
      waitUntil: "domcontentloaded",
    });
    await expect(this.phoneInput).toBeVisible({ timeout: 30_000 });
  }

  async fillBranchDetailsForm(data: { phone: string; address: string }) {
    await this.fillPhoneNumber(data.phone);
    await this.fillCountryCode();
    await this.fillAdressLatandLong(data.address);
    await this.selectWasteType();
    await this.selectPaymentMethod();
    await this.selectPreferredDay();
    await this.selectPreferredTime();
    await this.uploadImage();
  }

  async selectAntDropdownOption(fieldId: string, optionIndex = 0) {
    await this.page.locator(`#${fieldId}`).click();
    const option = this.page
      .locator("div.ant-select-dropdown")
      .last()
      .locator(".ant-select-item-option, [role='option']")
      .nth(optionIndex);
    try {
      await option.waitFor({ state: "attached", timeout: 15_000 });
      await option.click({ force: true });
    } catch (err) {
      if (this.page.isClosed()) throw err;
      await this.page.locator(`#${fieldId}`).focus();
      await this.page.keyboard.press("ArrowDown");
      await this.page.keyboard.press("Enter");
    }
  }

  async fillCountryCode() {
    await this.countryCodeInput.click();
    const option = this.page
      .locator("div.ant-select-dropdown")
      .last()
      .locator(".ant-select-item-option, [role='option']")
      .filter({ hasText: /Egypt|مصر|\+20/ })
      .first();
    await option.waitFor({ state: "visible", timeout: 15_000 });
    await option.click();
    await expect(this.AdressInput).toBeEnabled({ timeout: 15_000 });
  }

  async fillAdressLatandLong(LatAndLong: string) {
    await expect(this.AdressInput).toBeEnabled({ timeout: 15_000 });
    const zoneLookup = this.page.waitForResponse(
      (response) =>
        response.request().method() === "POST" &&
        response.request().postData()?.includes("getZoneByLatLng") &&
        response.ok(),
      { timeout: 30_000 }
    );
    await this.AdressInput.fill(LatAndLong);
    await this.AdressInput.press("Tab");
    await zoneLookup;

    const loading = this.page.getByText("جاري التحميل");
    if (await loading.isVisible({ timeout: 2_000 }).catch(() => false)) {
      await expect(loading).toBeHidden({ timeout: 30_000 });
    }

    const governorateError = this.page.getByText("يجب اختيار المحافظة التابع لها الفرع");
    if (await governorateError.isVisible({ timeout: 2_000 }).catch(() => false)) {
      await this.selectAddressHierarchy();
    }

    await expect(governorateError).toBeHidden({ timeout: 15_000 });
  }

  private async selectAddressDropdown(label: string, optionIndex = 0) {
    const formItem = this.page.locator(".ant-form-item").filter({ hasText: label }).first();
    await formItem.locator(".ant-select-selector").click();
    const dropdown = this.page.locator("div.ant-select-dropdown:not(.ant-select-dropdown-hidden)");
    await expect(dropdown.last()).toBeVisible({ timeout: 15_000 });
    await dropdown.last().locator(".ant-select-item-option").nth(optionIndex).click();
  }

  private async selectAddressHierarchy() {
    await this.selectAddressDropdown("اسم المحافظة");
    await this.selectAddressDropdown("اسم المدينة");
    await this.selectAddressDropdown("اسم الزون");
  }

  async selectPaymentMethod() {
    await this.selectAntDropdownOption("paymentMethod");
  }

  async selectPreferredTime() {
    await this.preferredTime.click();
  }

  async selectPreferredDay() {
    await this.preferredDay.click();
  }

  async selectWasteType() {
    const oilWrapper = this.page
      .locator(".ant-checkbox-wrapper")
      .filter({ hasText: "زيت مستعمل" });
    await oilWrapper.scrollIntoViewIfNeeded();
    const checkbox = oilWrapper.locator('input[type="checkbox"]');
    if (!(await checkbox.isChecked())) {
      await oilWrapper.click();
    }
    await expect(checkbox).toBeChecked();

    const oilPriceInput = this.page.getByPlaceholder("أدخل سعر الكيلو");
    if (await oilPriceInput.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await oilPriceInput.fill("10");
    }

    await expect(this.collectablesTypeErrorMessage).toBeHidden({ timeout: 5_000 });
  }

  async uploadImage() {
    await this.page.getByRole("heading", { name: "الصور" }).scrollIntoViewIfNeeded();
    const bannerInput = this.page.locator("#bannerImage");
    if (await bannerInput.count()) {
      await bannerInput.setInputFiles(images.banner);
      return;
    }
    await this.page.locator('input[type="file"]').first().setInputFiles(images.banner);
  }

  async clickAddBranchBTN() {
    await this.addBranchBTN.scrollIntoViewIfNeeded();
    await this.addBranchBTN.click();
    await expect(this.page.getByRole("heading", { name: "تم إضافة الفرع" })).toBeVisible({
      timeout: 60_000,
    });
  }

  registerBusinessRequestLink(): Locator {
    return this.page.getByRole("link", { name: "تسجيل طلب بيزنس" });
  }

  /**
   * Full B2B create-branch flow: branch step (إضافة فرع جديد → client → English name → type → التالي)
   * then this form (phone, address, payment, preferences, image, إضافة فرع).
   * Returns the same `data` object so callers can reuse branchName/phone for search.
   */
  async completeB2BCreateNewBranchFlow(data: B2BNewBranchFlowData) {
    await this.completeB2BBBranchWizard(data.branchName);
    await this.fillBranchDetailsForm(data);
    await this.clickAddBranchBTN();
    return data;
  }
}
