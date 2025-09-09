import { expect, type Locator, type Page } from "@playwright/test";
import BasePage from "./base-page";
import { BAD_USERNAME_PASSWORD_ERROR_MESSAGE } from "../test-data/constants";

export default class LoginPage extends BasePage {
  readonly txtUsername: Locator;
  readonly txtPassword: Locator;
  readonly btnLogin: Locator;
  readonly hdrError: Locator;
  readonly AdminRadioBtn: Locator;
  readonly UserRadioBtnLocator: Locator;
  static readonly RootAdmin = Symbol("RootAdmin");

  constructor(page: Page) {
    super(page);
    this.btnLogin = this.page.locator("#submit_but");
    this.hdrError = this.page.locator("#id_warn");
    this.txtUsername = this.page.locator("#f_username");
    this.txtPassword = this.page.locator("#pre_pwd");
    this.AdminRadioBtn = this.page.locator("#f_type1");
    this.UserRadioBtnLocator = this.page.locator("#f_type2");
  }

  async goTo() {
    await this.page.goto(process.env.URL);
  }

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

  async expectBadUsernamePassword() {
    await expect(this.hdrError).toHaveText(BAD_USERNAME_PASSWORD_ERROR_MESSAGE, { timeout: 3000 });
  }

  async verifyPageTitle() {
    await this.page.waitForLoadState("domcontentloaded"); // або 'load'
    await expect(this.page.getByText("Please Select Your Account:")).toBeVisible();
  }
}
