import { expect, type Locator, type Page } from "@playwright/test";
import { CheckoutPageHeaders } from "../test-data/constants";
import BasePage from "./base-page";
import { BASE_URL } from "../test-data/constants";
export default class CheckoutPage extends BasePage {
  readonly btnContinue: Locator;
  readonly btnFinish: Locator;
  readonly btnBackHome: Locator;
  readonly txtFirstName: Locator;
  readonly txtLastName: Locator;
  readonly txtPostalCode: Locator;
  readonly spanPageTitle: Locator;

  constructor(page: Page) {
    super(page);
    this.btnContinue = this.page.getByTestId("continue");
    this.btnFinish = this.page.getByTestId("finish");
    this.btnBackHome = this.page.getByTestId("back-to-products");
    this.txtFirstName = this.page.getByTestId("firstName");
    this.txtLastName = this.page.getByTestId("lastName");
    this.txtPostalCode = this.page.getByTestId("postalCode");
    this.spanPageTitle = this.page.getByTestId("title");
  }

  async goto() {
    await this.page.goto(new URL(process.env.URL ?? BASE_URL, "/checkout-step-one.html").href);
    // https://www.saucedemo.com/checkout-step-two.html
    // https://www.saucedemo.com/checkout-complete.html
  }

  async enterCheckoutInformation(firstName: string, lastName: string, postalCode: string) {
    await this.txtFirstName.fill(firstName);
    await this.txtLastName.fill(lastName);
    await this.txtPostalCode.fill(postalCode);
    await this.btnContinue.click();
  }

  async finishCheckout() {
    await this.btnFinish.click();
  }

  async clickBackHome() {
    await this.btnBackHome.click();
  }

  async verifyPageTitleInformation(header: CheckoutPageHeaders) {
    await expect(this.spanPageTitle).toBeVisible({ timeout: 3000 });
    await expect(this.spanPageTitle).toHaveText(header.toString(), { timeout: 3000 });
  }
}
