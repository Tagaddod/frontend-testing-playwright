import { Locator, Page } from "@playwright/test";

export class requestDetails{
    readonly enterDate:Locator;
    readonly enterNotes:Locator;
    readonly submitButton:Locator;
    readonly pickupTime:Locator;

      

    constructor(private page:Page){
        this.enterDate=page.locator('#pickupDate');
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

      async selectPickupTime(){
          await this.pickupTime.click();
      }

    async ClickEnterDateButton(){
      const today = new Date();

      const formattedDate =
        `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
      
      await this.enterDate.fill(formattedDate);    
}

}