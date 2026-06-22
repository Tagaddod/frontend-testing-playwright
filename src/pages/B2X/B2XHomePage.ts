import { Locator, Page } from "@playwright/test";
import { URLs } from "../../config/urls";

export class B2XHomePage {
  readonly searchTraderInput:Locator;
  readonly addNewTraderBTN:Locator;
  readonly nextBTN:Locator;

  constructor(private page: Page) {
    this.searchTraderInput = page.locator('#searchTrader');
    this.addNewTraderBTN = page.locator('#addNewTrader');
    this.nextBTN = page.locator('#next');
  }

async open() {
  await this.page.goto(URLs.b2x.base, { waitUntil: "domcontentloaded" });
}
 
 async searchExistTrader(traderName: string) {
  await this.searchTraderInput.fill(traderName); 
  await this.page.locator(`.ant-select-item-option:has-text(${traderName})`).first().click();
  await this.nextBTN.click();
 }
 async addNewTrader(traderName:string){
  await this.searchTraderInput.fill(traderName);
  await this.addNewTraderBTN.click();
 }

}