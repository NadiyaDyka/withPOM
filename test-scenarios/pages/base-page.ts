import { Page } from "playwright";
import { expect } from '@playwright/test';
import { NETWORK_IDLE } from "../test-data/constants";
import fs from "fs";
import path from "path";

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

  //can be used for debugging only
  //async hardWait(milliseconds: number) {
  //  await this.page.waitForTimeout(milliseconds);
  //}

  async verifyPageTitle() {
    // Add way to verify page, like title or something.
  }
}
