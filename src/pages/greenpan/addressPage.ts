import { Locator, Page } from "@playwright/test";

export class addressPage{
    readonly governorateDropdown : Locator;
    readonly areaInputDropdown:Locator;
    readonly districtInputDropdown :Locator;
    readonly streetNameInput : Locator;
    readonly buildingInput : Locator;
    readonly apartmentInput :Locator;
    readonly floorInput: Locator;
    readonly clientName:Locator;
    readonly addAddress:Locator;

    constructor(private page: Page){
        this.governorateDropdown = page.locator('button[role="combobox"]').filter({ hasText: 'اختر المحافظة' });
        this.areaInputDropdown=page.locator('button[role="combobox"]').filter({hasText:'اختر المنطقة'});
        this.districtInputDropdown = page.locator('button[role="combobox"]').filter({hasText:'اختر الحي'});
        this.streetNameInput=page.locator('#addAddressForm-street');
        this.buildingInput=page.locator('#addAddressForm-building');
        this.apartmentInput=page.locator('#addAddressForm-apartment');
        this.floorInput=page.locator('#addAddressForm-floor');
        this.clientName=page.locator('#addAddressForm-customerName');
        this.addAddress=page.getByRole('button',{name:'إضافة عنوان'});
    }
    async selectGovernorate(name: string) {
        await this.governorateDropdown.click();
        await this.page.getByRole('option', { name }).click();
    }
      async selectArea(name:string){
        await this.areaInputDropdown.click();
        await this.page.getByRole('option',{name}).click();
        
      }
      async selectDistrict(name:string){
        await this.districtInputDropdown.click();
        await this.page.getByRole('option', { name }).click();
      }
      async enterStreetName(streetName : string){
        await this.streetNameInput.fill(streetName);
      }
      async enterBuilding(bulding : string){
        await this.buildingInput.fill(bulding);
      }
      async enterApartment(apartment:string){
        await this.apartmentInput.fill(apartment);
      }
      async enterFloor(floor : string){
        await this.floorInput.fill(floor);
      }
      async enterClientName(Client:string){
        await this.clientName.fill(Client);
      }
      async addAddressButton(){await this.addAddress.click();}

}