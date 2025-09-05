import { Then } from "../utils/fixtures";
import { LOGGER } from "../utils/Logger";

Then("The DLINKHDD page is displayed", async ({ dlinkhddPage }) => {
  LOGGER.info(`The DLINKHDD page is displayed`);
  dlinkhddPage.verifyPageTitle();
});
