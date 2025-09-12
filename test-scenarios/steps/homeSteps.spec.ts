import { Then } from "../utils/fixtures";
import { LOGGER } from "../utils/Logger";

Then("The Home page is displayed", async ({ homePage }) => {
  LOGGER.info(`The Home page is displayed`);
  homePage.verifyPageTitle();
});
