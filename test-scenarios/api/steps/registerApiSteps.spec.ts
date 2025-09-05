import { Given } from "../../utils/fixtures";
import { LOGGER } from "../../utils/Logger";

Given(
  "The user sets up a POST register request with {string} and {string}",
  async ({}, username: string, password: string) => {
    LOGGER.info(`The user sets up a POST register request with ${username} and ${password}`);
  }
);
