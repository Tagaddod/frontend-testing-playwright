import { Locator, Page } from "@playwright/test";

export class requestDetails{
    readonly enterDate:Locator;
    readonly enterNotes:Locator;
    readonly submitButton:Locator;
    readonly pickupTime:Locator;

      

    constructor(private page:Page){
        this.enterDate=page.locator('input[id="pickupDate"]');
        this.enterNotes=page.locator('#notes');
        this.submitButton=page.getByRole('button', { name: 'إرسال الطلب' });
        this.pickupTime=page.getByText('الفجر');

    }  
      async enterNotesText(notes: string) {
        await this.enterNotes.fill(notes);
      }

      async ClickSubmitButton(){
        await this.submitButton.click();
      }

      async selectPickupTime() {
        await this.page.keyboard.press("Escape");
        await this.pickupTime.click({ force: true });
      }

      async ClickEnterDateButton() {
        const today = new Date();
      
        const day = String(today.getDate()).padStart(2, "0");
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const year = today.getFullYear();
      
        await this.enterDate.fill(`${day}/${month}/${year}`);
      }

}