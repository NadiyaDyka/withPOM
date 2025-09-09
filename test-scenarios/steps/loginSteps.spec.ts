import { Given, Then, When } from "../utils/fixtures";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { cleanTest as test } from "../utils/fixtures";
import { LOGGER } from "../utils/Logger";
import LoginPage from "../pages/login-page";
import * as ENV from "../utils/env";

Given("The user navigates to the login page", async ({ loginPage }) => {
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

//When("The user enters {string} and {string}", async ({ loginPage }, usernameKey: string, passwordKey: string) => {
//  const username = process.env[usernameKey] || usernameKey;
//  const password = process.env[passwordKey] || passwordKey;
//  LOGGER.info(`The user enters "${process.env[usernameKey]}" and "${process.env[passwordKey]}"`);
//LOGGER.info(`The user enters "${usernameKey}" and appropriate password → resolved as "${username}" / "password"`);
//  await loginPage.login(username, password);
//});

When("The user enters {string} only", async ({ loginPage }, passwordKey: string) => {
  const password = process.env[passwordKey] || passwordKey;
  LOGGER.info(`The user enters password "${passwordKey}" for sysadmin user`);
  //LOGGER.info(`The user doesn't enter user, but correct password for sysadmin only password"`);
  await loginPage.login(LoginPage.RootAdmin, password);
});

When("The user enters incorrect {string} password", async ({ loginPage }, usernameKey: string, passwordKey: string) => {
  const password = process.env[passwordKey] || passwordKey;
  LOGGER.info(`The user enters incorrect password "${passwordKey}" for sysadmin user`);
  await loginPage.login(LoginPage.RootAdmin, password);
});

Then("The Login page is displayed", async ({ loginPage }) => {
  LOGGER.info(`The Login page is displayed`);
  loginPage.verifyPageTitle();
});

Then("The {string} error is displayed", async ({ loginPage }, errorMessage: string) => {
  LOGGER.info(`The "${errorMessage}" error is displayed`);
  await loginPage.wait(); // The promise resolves after 'load' event.
  if (errorMessage.toLowerCase() == "badusernamepassword") {
    await loginPage.expectBadUsernamePassword();
  } else {
    LOGGER.error(`Unrecognized error: "${errorMessage}"`);
  }
});
