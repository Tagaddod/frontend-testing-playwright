import { Locator, Page } from "@playwright/test";
import { images } from "../../utils/images";
import { B2BHomePage } from "./B2BHomePage";

export type B2BNewBranchFlowData = {
  branchName: string;
  phone: string;
  address: string;
};

export class NewClientForm{
    readonly phoneInput:Locator;
    readonly countryCodeInput:Locator;
    readonly AdressInput:Locator;
    readonly paymentMethod:Locator;
    readonly preferredTime:Locator;
    readonly addBranchBTN:Locator;
    readonly preferredDay:Locator;
    readonly phoneErrorMessage: Locator;
    readonly addressErrorMessage: Locator;

    constructor(private page: Page){
        this.phoneInput=page.locator('#primaryPhoneNumber');
        this.countryCodeInput=page.locator('#primaryCountryCode');
        this.AdressInput=page.locator('#address');
        this.paymentMethod=page.locator('#paymentMethod');
        this.preferredTime=page.locator('.ant-radio-button-wrapper').filter({ hasText: 'صباحاَ' });
        this.addBranchBTN=page.getByRole('button', { name: 'إضافة فرع' });
        this.preferredDay=page.getByText('الاحد', { exact: true });
        this.phoneErrorMessage=page.locator('.ant-form-item:has(#primaryPhoneNumber) .ant-form-item-explain-error');
        this.addressErrorMessage=page.locator('.ant-form-item:has(#address) .ant-form-item-explain-error');
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
    }

    async fillBranchDetailsForm(data: { phone: string; address: string }) {
        await this.fillPhoneNumber(data.phone);
        await this.fillCountryCode();
        await this.fillAdressLatandLong(data.address);
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
        await this.selectAntDropdownOption("primaryCountryCode");
    }
    async fillAdressLatandLong(LatAndLong : string){
        await this.AdressInput.fill(LatAndLong);
    }
    async selectPaymentMethod(){
        await this.selectAntDropdownOption("paymentMethod");
    }
    async selectPreferredTime(){
        await this.preferredTime.click();
    }
    async selectPreferredDay(){
        await this.preferredDay.click();
    }
    async uploadImage(){
        await this.page.setInputFiles('#bannerImage',images.banner);
    }
    async clickAddBranchBTN(){
        await this.addBranchBTN.click();
    }

    /**
     * Full B2B create-branch flow: branch step (إضافة فرع جديد → client → English name → type → التالي)
     * then this form (phone, address, payment, preferences, image, إضافة فرع).
     */
    async completeB2BCreateNewBranchFlow(data: B2BNewBranchFlowData) {
        await this.completeB2BBBranchWizard(data.branchName);
        await this.fillBranchDetailsForm(data);
        await this.clickAddBranchBTN();
    }

}
