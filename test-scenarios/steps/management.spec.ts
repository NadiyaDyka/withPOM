import ManagementPage from "../pages/management-page";
import { Given, Then, When } from "../utils/fixtures";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { cleanTest as test } from "../utils/fixtures";
import { LOGGER } from "../utils/Logger";
import LoginPage from "../pages/login-page";

Given("The user is logged in as Admin", async ({ page, loginPage }) => {
  // Navigate to the login page
  await loginPage.goTo();
  // Enter only the password (skip username)
  const password = process.env.CPPSWD || "CPPSWD";
  await loginPage.login(LoginPage.RootAdmin, password);
  LOGGER.info(`The user is logged in as Admin`);
});

When("The user opens the UPnP AV Server tab", async ({ page }) => {
  const managementPage = new ManagementPage(page);
  await managementPage.openApplicationManagement();
  await managementPage.openUpnpTabMenu();
  LOGGER.info(`The user opens the UPnP AV Server tab`);
});

When("The user clicks Refresh All button and waits for completion", async ({ page }) => {
  const managementPage = new ManagementPage(page);
  await managementPage.ensureRefreshAllReady1();
});
