import { Page } from "playwright";
import { NETWORK_IDLE } from "../test-data/constants";
export default class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async getPage() {
    return this.page;
  }

  async getUrl() {
    return this.page.url();
  }

  async waitForNetworkIdle() {
    await this.page.waitForLoadState(NETWORK_IDLE);
  }

  async wait() {
    await this.waitForNetworkIdle();
  }

  //can be used for debugging only
  async hardWait(milliseconds: number) {
    await this.page.waitForTimeout(milliseconds);
  }

  async verifyPageTitle() {
    // Add way to verify page, like title or something.
  }
}
