import { Page } from '@playwright/test';
import { GreenpanHomePage } from '../pages/greenpan/GreenpanHomePage';
import { addressPage} from '../pages/greenpan/addressPage';
import {sendRequestPage} from '../pages/greenpan/sendRequestPage';
import {sendB2BRequestPage} from '../pages/b2b/sendB2BRequestPage';
import { NewClientForm } from '../pages/b2b/NewClientForm';
import { requestDetails } from '../pages/b2b/requestDetails';
import { B2BHomePage } from '../pages/b2b/B2BHomePage';

export class PoManager {
  private page: Page;
  private greenpanHome?: GreenpanHomePage;
  private addressPage?: addressPage;
  private sendRequest?: sendRequestPage;
  private sendB2BRequest?: sendB2BRequestPage;
  private newClientForm?: NewClientForm;
  private requestDetails?: requestDetails;
  private b2bHome?: B2BHomePage;


  constructor(page: Page, greenpanHome?: GreenpanHomePage) {
    this.page = page;
    this.greenpanHome = greenpanHome;
  }

  getGreenpanHome() {
    if (!this.greenpanHome) this.greenpanHome = new GreenpanHomePage(this.page);
    return this.greenpanHome;
  }

  getAddressPage() {
    if (!this.addressPage) this.addressPage = new addressPage(this.page);
    return this.addressPage;
  }

  getSendRequestPage(){
    if (!this.sendRequest) this.sendRequest = new sendRequestPage(this.page);
    return this.sendRequest;
  }
  getSendB2BRequestPage(){
    if (!this.sendB2BRequest) this.sendB2BRequest = new sendB2BRequestPage(this.page);
    return this.sendB2BRequest;
  }
  getNewClientForm(){
    if (!this.newClientForm) this.newClientForm = new NewClientForm(this.page);
    return this.newClientForm;
  }
 getB2BHomePage(){
    if (!this.b2bHome) this.b2bHome = new B2BHomePage(this.page);
    return this.b2bHome;
  }
  getRequestDetails(){
    if (!this.requestDetails) this.requestDetails = new requestDetails(this.page);
    return this.requestDetails;
  }

  /**
   * @see {@link NewClientForm.completeB2BCreateNewBranchFlow}
   */
  async completeB2BCreateNewBranchFlow(data: {
    branchName: string;
    phone: string;
    address: string;
  }) {
    return this.getNewClientForm().completeB2BCreateNewBranchFlow(data);
  }

}

export default PoManager;
