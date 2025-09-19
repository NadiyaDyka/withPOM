import { Page } from "playwright";
import { expect } from "@playwright/test";
import { NETWORK_IDLE } from "../test-data/constants";


export default class BasePage {
  constructor(protected page: Page) {}

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

  /**
   * Waits until the SPA view is fully loaded.
   * Checks both URL pattern and a unique element in the DOM.
   */
  async waitForSpaPage(expectedUrlPattern: RegExp, uniqueLocator: string) {
    await expect(this.page).toHaveURL(expectedUrlPattern);
    await expect(this.page.locator(uniqueLocator)).toBeVisible();
  }

  async popupIsVisible(text: string, timeout: number = 6000): Promise<boolean> {
    const popup = this.page.getByText(text, { exact: true });

    try {
      await popup.waitFor({ state: "visible", timeout });
      console.log(`✅ Popup "${text}" is visible`);
      return true;
    } catch {
      console.log(`❌ Popup "${text}" is NOT visible`);
      return false;
    }
  }

  //can be used for debugging only
  //async hardWait(milliseconds: number) {
  //  await this.page.waitForTimeout(milliseconds);
  //}

  async verifyPageTitle() {
    // Add way to verify page, like title or something.
  }
}
