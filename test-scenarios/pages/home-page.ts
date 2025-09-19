import { expect, type Page } from "@playwright/test";
import BasePage from "./base-page";
import { BASE_URL } from "../test-data/constants";

export default class HomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async wait() {
    await this.page.waitForLoadState(); // The promise resolves after 'load' event.
    await this.page.waitForURL("**/web/home.html");
  }

  async goto() {
    await this.page.goto(new URL(process.env.URL ?? BASE_URL, "/web/home.html").href);
  }

  async verifyPageTitle() {
    // чекаємо появи тексту "My Folder" на сторінці
    await expect(this.page.getByText("My Folder")).toBeVisible();
    //await this.wait();
    
  }
}
