import ManagementPageAV from "../pages/management_av_server-page";
import { Given, Then, When } from "../utils/fixtures";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { test as test } from "../utils/fixtures";
import { LOGGER } from "../utils/Logger";
import LoginPage from "../pages/login-page";
import { expect } from "@playwright/test";

Given("The user is logged in as Admin", async ({ page, loginPage }) => {
  // Navigate to the login page
  await loginPage.goTo();
  // Enter only the password (skip username)
  const password = process.env.CPPSWD || "CPPSWD";
  await loginPage.login(LoginPage.RootAdmin, password);
  LOGGER.info(`The user is logged in as Admin`);
});

Given("The user opens Management menu", async ({ page }) => {
  LOGGER.debug(`Try to open Management page`);
  const managementPageAV = new ManagementPageAV(page);
  await managementPageAV.openMenuManagement();
  LOGGER.info(`The user opened the Management menu`);
});

Given("The user opens Application Management menu", async ({ page }) => {
    LOGGER.debug(`Try to open Application Management menu`);
    const managementPageAV = new ManagementPageAV(page);        
    await managementPageAV.openApplicationManagement();
    LOGGER.info(`The user opened the Application Management menu`);
  });

Given("The user opens the UPnP AV Server tab", async ({ page }) => {
  const managementPageAV = new ManagementPageAV(page);
  expect(await managementPageAV.openUpnpTabMenu()).toBe(true);
  LOGGER.info(`The user opened the UPnP AV Server tab`);
});  

Then("The user leaves to another tab", async ({ page }) => {
  const managementPageAV = new ManagementPageAV(page);
  expect(await managementPageAV.openAnotherTabMenu()).toBe(true);
  LOGGER.info(`The user leaved to another tab`);
});

Then("The user see the progress bar", async ({ page }) => {
  const managementPageAV = new ManagementPageAV(page);
  expect(await managementPageAV.progressBarIsVisible()).toBe(true);
  LOGGER.info(`The user see the progress bar`);
});

Then("The user waits for completion", async ({ page }) => {
  const managementPageAV = new ManagementPageAV(page);
  expect(await managementPageAV.waitForProgressFinished()).toBe(true);
  LOGGER.info(`The user waits for completion`);
});

Then("The user gets finish popoup visible", async ({ page }) => {
  const managementPageAV = new ManagementPageAV(page);
  expect(await managementPageAV.popupRefreshedSuccessfullyIsVisible()).toBe(true); // ✅ Asserts that the popup is visible
  LOGGER.info(`The user got finish popoup visible`);
});

Then("The user close the popup", async ({ page }) => {
  const managementPageAV = new ManagementPageAV(page);
  expect(await managementPageAV.userClosePopupRefreshedSuccessfully()).toBe(true);
  LOGGER.info(`The user closed the popup`);
});

Then("The user gets the Refresh All button is visible and enabled", async ({ page }) => {
  const managementPageAV = new ManagementPageAV(page);
  expect(await managementPageAV.getRefreshAllButtonVisibleAndEnabled()).toBe(true);
  LOGGER.info(`The Refresh All button was visible and enabled to the user.`);
});

Then("The user clicks Refresh All button", async ({ page }) => {
  const managementPageAV = new ManagementPageAV(page);
  expect(await managementPageAV.clickRefreshAll()).toBe(true);
  LOGGER.info(`The user clicked Refresh All button`);
});
