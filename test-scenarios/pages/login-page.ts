import { expect, type Locator, type Page } from "@playwright/test";
import BasePage from "./base-page";
import { INCORRECT_CREDENTIALS_ERROR_MESSAGE } from "../test-data/constants";
import { pageTexts } from "../utils/textParser";

export default class LoginPage extends BasePage {
  readonly page: Page;
  readonly txtUsername: Locator;
  readonly txtPassword: Locator;
  readonly btnLogin: Locator;
  readonly hdrError: Locator;
  readonly AdminRadioBtn: Locator;
  readonly UserRadioBtnLocator: Locator;
  static readonly RootAdmin = Symbol("RootAdmin");
  private texts: Record<string, string>;

  constructor(page: Page) {
    super(page);
    this.page = page;
    // Initialize locators
    this.btnLogin = this.page.locator("#submit_but");
    this.hdrError = this.page.locator("#id_warn");
    this.txtUsername = this.page.locator("#f_username");
    this.txtPassword = this.page.locator("#pre_pwd");
    this.AdminRadioBtn = this.page.locator("#f_type1");
    this.UserRadioBtnLocator = this.page.locator("#f_type2");
    // Initialize texts from JSON
    this.texts = pageTexts.loginPage;
  }
  // Navigate to the login page
  async goTo() {
    await this.page.goto(process.env.URL);
  }
  // Perform login with username (or without entering username) and password
  async login(username: string | typeof LoginPage.RootAdmin, password: string) {
    if (username !== LoginPage.RootAdmin) {
      await expect(this.UserRadioBtnLocator).toBeVisible();
      await this.UserRadioBtnLocator.check();

      await expect(this.txtUsername).toBeVisible();
      await this.txtUsername.fill(username);
    }
    await expect(this.txtPassword).toBeVisible();
    await this.txtPassword.fill(password);

    await expect(this.btnLogin).toBeEnabled();
    await this.btnLogin.click();
  }

  async expectIncorrectCredentials() {
    await expect(this.hdrError).toBeVisible({ timeout: 3000 });
    await expect(this.hdrError).toHaveText(INCORRECT_CREDENTIALS_ERROR_MESSAGE, { timeout: 3000 });
  }

  async expectRadiosetToBeVisible() {
    await expect(this.AdminRadioBtn).toBeVisible();
    await expect(this.UserRadioBtnLocator).toBeVisible();
  }

  // Get text from JSON by key
  getTextByKey(key: keyof typeof this.texts) {
    return this.texts[key];
  }

  // make sure that the text is visible on the page
  async expectTextVisible(key: keyof typeof this.texts) {
    const text = this.getTextByKey(key);
    await expect(this.page.locator(`text=${text}`)).toBeVisible();
  }

  async verifyPageTitle() {
    await this.page.waitForLoadState("domcontentloaded"); // або 'load'
    await expect(this.page.getByText("Please Select Your Account:")).toBeVisible();
  }
}
