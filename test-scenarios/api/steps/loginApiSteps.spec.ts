import { Given, Then, When } from "../../utils/fixtures";
import { LOGGER } from "../../utils/Logger";
import { APIResponse, expect } from "@playwright/test";

let response: APIResponse;
Given(
  "The user sets up a POST login request with {string} and {string}",
  async ({ loginApi }, userEmail: string, userPassword: string) => {
    LOGGER.info(`The user sets up a POST login request with ${userEmail} and ${userPassword}`);
    loginApi.setupRequest(userEmail, userPassword);
  }
);

When("The user sends login POST http request", async ({ loginApi }) => {
  LOGGER.info("The user sends login POST http request");
  response = await loginApi.getAPIRequestContext().post(loginApi.apiUrl, {
    data: {
      email: loginApi.userEmail,
      password: loginApi.userPassword,
    },
  });
});

When("The user sends a login POST http request missing the password field", async ({ loginApi }) => {
  LOGGER.info("The user sends a login POST http request missing the password field");
  response = await loginApi.getAPIRequestContext().post(loginApi.apiUrl, {
    data: {
      email: loginApi.userEmail,
    },
  });
});

When("The user sends a login POST http request missing the email field", async ({ loginApi }) => {
  LOGGER.info("The user sends a login POST http request missing the email field");
  response = await loginApi.getAPIRequestContext().post(loginApi.apiUrl, {
    data: {
      password: loginApi.userPassword,
    },
  });
});

Then("The user receives valid login Response", async ({}) => {
  LOGGER.info(`The user receives valid login Response`);
  expect(response.ok()).toBeTruthy();
});

Then("The user receives {string} error login response", async ({}, errorMessage: string) => {
  LOGGER.info(`The user receives ${errorMessage} error login response`);
  expect(response.ok()).toBeFalsy();
  const responseData = await response.json();
  LOGGER.info(`Thing is: "${typeof responseData}"`);
  expect(responseData.error).toEqual(errorMessage);
});
