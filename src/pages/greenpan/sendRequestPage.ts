import { expect, Locator, Page } from "@playwright/test";


export class sendRequestPage{

    readonly selectDayCard:Locator;
    readonly sendRequestButton : Locator;
    readonly sucessMessage :Locator;
    

constructor (private page : Page)
{
    this.selectDayCard= this.page.locator('input[name="tripDay"] + div');
    this.sendRequestButton = this.page.getByRole('button', { name: 'إرسال الطلب' });
    this.sucessMessage = page.getByRole('heading', {name: 'تم إرسال الطلب',});
}

async selectDay() {
    await this.selectDayCard.nth(1).click();
  }
async sendRequest(){
    await this.sendRequestButton.click();
}
async assertSucessMessage(){
    await expect(this.sucessMessage).toBeVisible();
}

}