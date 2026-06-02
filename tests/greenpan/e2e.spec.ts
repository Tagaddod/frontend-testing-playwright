import { test, expect } from "../../src/fixtures/loginFixture";
import { PoManager } from "../../src/core/PoManager";
import testdata from "../../src/utils/testdata.json";

test.describe("GreenPan Full Flow Tests", { tag: ["@greenpan", "@e2e"] }, () => {
  let po: PoManager;

  test.beforeEach(async ({ page }) => {
    po = new PoManager(page);
    await po.getGreenpanHome().open();
    await expect(page).toHaveURL(/greenpan/);
    await expect(po.getGreenpanHome().dashboardText()).toBeVisible();
  });

  // ---------------------------------
  test("Open GreenPan with valid new user", async () => {
   
    await po.getGreenpanHome().EnterPhoneNumber(testdata.phones.validNewUser);
    //await expect(po.getGreenpanHome().textQuestion()).toBeVisible();

    await po.getGreenpanHome().EnterQuantity(testdata.quantities.medium);
    await expect(po.getGreenpanHome().textRewards()).toBeVisible();

    await po.getGreenpanHome().AddGift(0);
    await po.getGreenpanHome().NextStep();

    const cairo = testdata.addresses.cairo;
    await po.getAddressPage().selectGovernorate(cairo.governorate);
    await po.getAddressPage().selectArea(cairo.area);
    await po.getAddressPage().selectDistrict(cairo.district);
    await po.getAddressPage().enterStreetName(cairo.street);
    await po.getAddressPage().enterBuilding(cairo.building);
    await po.getAddressPage().enterApartment(cairo.apartment);
    await po.getAddressPage().enterFloor(cairo.floor);
    await po.getAddressPage().enterClientName(cairo.clientName);
    await po.getAddressPage().addAddressButton();

    await po.getSendRequestPage().selectDay();
    await po.getSendRequestPage().sendRequest();
    await po.getSendRequestPage().assertSucessMessage();
  });

  test("Open GreenPan with valid existing user", async () => {
   
    await po.getGreenpanHome().EnterPhoneNumber(testdata.phones.validUser);
   // await expect(po.getGreenpanHome().textQuestion()).toBeVisible();

    await po.getGreenpanHome().EnterQuantity(testdata.quantities.medium);
    await expect(po.getGreenpanHome().textRewards()).toBeVisible();

    await po.getGreenpanHome().AddGift(0);
    await po.getGreenpanHome().NextStep();


    await po.getSendRequestPage().selectDay();
    await po.getSendRequestPage().sendRequest();
    await po.getSendRequestPage().assertSucessMessage();
  });

});