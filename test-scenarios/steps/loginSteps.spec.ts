import { Given, Then, When } from "../utils/fixtures";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { cleanTest as test } from "../utils/fixtures";
import { LOGGER } from "../utils/Logger";
import LoginPage from "../pages/login-page";
import * as ENV from "../utils/env";
import { pageTexts } from "../utils/textParser";

Given("The user navigates to the login page", async ({ loginPage }) => {
  // Here ({ loginPage }) is a destructuring of what was described in fixtures.ts.
  LOGGER.info("The user navigates to the login page");
  await loginPage.goTo();
});

When(
  "The user enters credentials {string} and {string}",
  async ({ loginPage }, usernameKey: string, passwordKey: string) => {
    const username = (ENV as Record<string, string>)[usernameKey] || usernameKey;
    const password = (ENV as Record<string, string>)[passwordKey] || passwordKey;

    LOGGER.info(`The user enters "${username}" and "${password}"`);

    await loginPage.login(username, password);
  }
);

When("The user enters {string} only", async ({ loginPage }, passwordKey: string) => {
  const password = process.env[passwordKey] || passwordKey;
  //LOGGER.info(`The user enters password "${password}" for sysadmin user`);
  LOGGER.info(`The user shouldn't enter username, but correct password for sysadmin only"`);
  await loginPage.login(LoginPage.RootAdmin, password);
});

When("The user enters incorrect SA password {string}", async ({ loginPage }, passwordKey: string) => {
  const password = process.env[passwordKey] || passwordKey;

  LOGGER.info(`The user enters incorrect password "${password}" for sysadmin user`);
  await loginPage.login(LoginPage.RootAdmin, password);
});

Then("The Login page is displayed", async ({ loginPage }) => {
  LOGGER.info(`The Login page is displayed`);
  loginPage.verifyPageTitle();
});

Then("The {string} error is displayed", async ({ loginPage }, errorMessage: string) => {
  const actual = await loginPage.hdrError.textContent();
  LOGGER.info(`The "${actual}" error is displayed`);

  if (errorMessage.toLowerCase() == "incorrectcredentials") {
    await loginPage.expectIncorrectCredentials();
  } else {
    LOGGER.error(`Unrecognized error: "${errorMessage}"`);
  }

  Then("The user can see the radio buttons for choosing user", async ({ loginPage }) => {
    await loginPage.expectRadiosetToBeVisible();
  });
});

Then(
  "text {string} on login page will be visible",
  async ({ loginPage }, textKey: keyof typeof pageTexts.loginPage) => {
    const textValue = loginPage.getTextByKey(textKey);
    LOGGER.info(`The text "${textValue}" is visible on the login page`);
    await loginPage.expectTextVisible(textKey);
  }
);
