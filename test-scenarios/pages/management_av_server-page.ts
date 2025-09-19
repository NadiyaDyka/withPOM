import { Page, Frame, expect } from "@playwright/test";
import BasePage from "./base-page";

/**
 * Page Object Model for "Management Page AV".
 * Encapsulates locators and actions for Application Management tabs and menus.
 */
export default class ManagementPageAV extends BasePage {
  // Tab names
  readonly upnpTabText = "UPnP AV Server";
  readonly anotherTabText = "FTP Server";
  // Tab locators (no hardcoded text/IDs inside methods anymore)
  readonly upnpTabSelector = "#m_2";
  readonly anotherTabSelector = "#m_1";

  // Selectors
  readonly iframeName = "mainFrame";
  readonly refreshButtonText = "Refresh All";
  readonly refreshButtonSelector = "#refresh_button";
  readonly progressBarSelector = "#progressbar";
  readonly successPopupText = "Refreshed Successfully.";
  readonly managementMenuSelector = "span[datafld='management']";
  readonly appMenuTextSelector = "#desc_app"; // submenu text
  readonly appMenuIconSelector = "#icon_app"; // submenu icon
  readonly popupOkButtonSelector = "#popup_ok";

  constructor(page: Page) {
    super(page);
  }

  /**
   * Helper: Get the actual Frame object from the main iframe.
   *
   * This function:
   * 1. Locates the iframe element using the predefined class constant `iframeName`.
   * 2. Waits until the iframe is visible on the page.
   * 3. Gets the ElementHandle for that iframe.
   * 4. From the ElementHandle, retrieves the actual Playwright Frame object.
   * 5. Throws an error if the frame cannot be found.
   * 6. Returns the Frame object so it can be used to interact with elements inside the iframe.
   *
   * @returns {Promise<Frame>} The Playwright Frame object for the iframe.
   * @throws {Error} If the iframe is not found or cannot be resolved to a Frame.
   */
  private async getFrame(): Promise<Frame> {
    // Step 1: Find the iframe element on the page using its name constant
    const iframeLocator = this.page.locator(`iframe[name="${this.iframeName}"]`);

    // Step 2: Wait until the iframe is visible on the page
    await expect(iframeLocator).toBeVisible();

    // Step 3: Get the ElementHandle for the iframe
    const iframeHandle = await iframeLocator.elementHandle();

    // Step 4: From the ElementHandle, get the actual Frame object
    const frame = await iframeHandle?.contentFrame();

    // Step 5: If no frame was found, throw an error
    if (!frame) {
      throw new Error("iframe not found");
    }
    // Step 6: Return the Frame object so you can interact with it
    return frame;
  }

  /**
   * Step: Open the "Management" menu from the Home page.
   *
   * This function finds the Management menu item on the page,
   * waits until it becomes visible (up to 2.5s),
   * and then clicks on it.
   */
  async openMenuManagement(): Promise<void> {
    // Locate the "Management" menu by its selector
    const managementMenu = this.page.locator(this.managementMenuSelector);

    // Wait until the element is visible (max 2500ms)
    await managementMenu.waitFor({ state: "visible", timeout: 2500 });

    // Click on the "Management" menu item
    await managementMenu.click();
  }

  /**
   * Step: Open the "Application Management" submenu.
   *
   * This function finds the Application Management submenu
   * under the Management menu, waits until it becomes visible,
   * and then clicks on it.
   *
   * Note: You can choose between clicking text (#desc_app)
   * or icon (#icon_app) by changing the selector constant.
   */
  async openApplicationManagement(): Promise<void> {
    // Locate the Application Management submenu by its selector
    const appMenuItem = this.page.locator(this.appMenuTextSelector);
    // Alternative: this.page.locator(this.appMenuIconSelector)

    // Wait until the element is visible (max 2500ms)
    await appMenuItem.waitFor({ state: "visible", timeout: 2500 });

    // Click on the submenu item
    await appMenuItem.click();
  }

  /**
   * Step: Open the "UPnP AV Server" tab inside Application Management.
   * Returns `true` if the tab was opened successfully, `false` otherwise.
   *
   * @example
   * const isOpened = await managementPage.openUpnpTabMenu();
   * if (!isOpened) throw new Error("Failed to open UPnP AV Server tab");
   */
  async openUpnpTabMenu(): Promise<boolean> {
    const tab = this.page.locator(this.upnpTabSelector, { hasText: this.upnpTabText });
    try {
      await tab.waitFor({ state: "visible", timeout: 3000 });
      await tab.click();
      return true;
    } catch (error) {
      console.error("❌ Failed to open UPnP AV Server tab:", error);
      return false;
    }
  }

  /**
   * Step: Open the "FTP Server" tab inside Application Management.
   * Returns `true` if the tab was opened successfully, `false` otherwise.
   *
   * @example
   * const isOpened = await managementPage.openAnotherTabMenu();
   * if (!isOpened) throw new Error("Failed to open FTP Server tab");
   */
  async openAnotherTabMenu(): Promise<boolean> {
    const aTab = this.page.locator(this.anotherTabSelector, { hasText: this.anotherTabText });
    try {
      await aTab.waitFor({ state: "visible", timeout: 2000 });
      await aTab.click();
      return true;
    } catch (error) {
      console.error("❌ Failed to open another tab:", error);
      return false;
    }
  }

  /**
   * Waits for the progress bar to appear inside the iframe.
   * @returns {Promise<boolean>} True if the progress bar appeared within 5s, false otherwise.
   */
  async progressBarIsVisible(): Promise<boolean> {
    // Get the iframe content as a Frame object
    const frame = await this.getFrame();

    // Find the progress bar element inside the frame
    const progressBar = frame.locator(this.progressBarSelector);

    try {
      // Wait until the progress bar becomes visible (max 5s)
      await progressBar.waitFor({ state: "visible", timeout: 7000 });

      // If no error was thrown, it means the progress bar appeared
      console.log("⏳ Progress bar appeared.");
      return true;
    } catch {
      // If timeout happens (no progress bar), we catch the error
      console.log("❌ Progress bar did not appear within 5s.");
      return false;
    }
  }

  /** ⏳ Wait until progress bar reaches 100% and return true if successful */
  async waitForProgressFinished(): Promise<boolean> {
    // Get the frame from the iframe
    const frame = await this.getFrame();
    // Locate the progress bar inside the frame
    const progressBar = frame.locator(this.progressBarSelector);
    // 🔍 Convert the Locator to an ElementHandle so we can interact with the actual DOM element
    const handle = await progressBar.elementHandle();

    // ❗ Check if the handle is null (meaning the element wasn't found)
    if (!handle) {
      console.log("❌ Could not get ElementHandle from progress bar locator");
      return false;
    }

    try {
      // ⏳ Wait until the progress bar's value reaches 100
      await this.page.waitForFunction(
        (element) => {
          // 📊 Get the current value of the progress bar (e.g., "45", "100")
          const valueStr = element.getAttribute("aria-valuenow") || "0";
          // 🔢 Convert the string to a number (e.g., "45" → 45)
          const progress = parseInt(valueStr, 10);
          // ✅ Return true if progress is 100 or more
          return progress >= 100;
        },
        handle // 🧩 Pass the actual DOM element to the function so it can be used inside
      );

      // 🎉 Log a message once the progress bar reaches 100%
      console.log("✅ Progress bar reached 100%");
      return true;
    } catch {
      console.log("❌ Progress bar did not reach 100%");
      return false;
    }
  }

  /** ✅ Checks if the "Refreshed Successfully" popup is visible */
  async popupRefreshedSuccessfullyIsVisible(): Promise<boolean> {
    return await this.popupIsVisible(this.successPopupText);
  }

  /**
   * Closes the "Refreshed Successfully" popup by clicking the OK button.
   *
   * This function performs the following steps:
   * 1. Waits for the OK button to become visible on the page.
   * 2. Waits for the button to become enabled (interactable).
   * 3. Clicks the button to close the popup.
   *
   * @returns {Promise<boolean>} - Returns true if the button was clicked successfully, false otherwise.
   */
  async userClosePopupRefreshedSuccessfully(): Promise<boolean> {
    // Create a locator for the OK button using the predefined selector
    const okButton = this.page.locator(this.popupOkButtonSelector);

    try {
      // Step 1: Wait until the OK button is visible in the DOM
      await okButton.waitFor({ state: "visible", timeout: 3000 });
      console.log("✅ OK button is visible");

      // Step 2: Wait until the button is enabled (not disabled)
      await expect(okButton).toBeEnabled({ timeout: 3000 });
      console.log("✅ OK button is enabled");

      // Step 3: Click the button to close the popup
      await okButton.click();
      console.log("✅ OK button clicked successfully");

      return true;
    } catch (error) {
      // If any step fails, log the error and return false
      console.error("❌ Failed to close popup:", error);
      return false;
    }
  }

  async ensureRefreshAllIsReady(): Promise<boolean> {
    let frame = await this.getFrame();
    let refreshButton = frame.getByText("Refresh All");
    let isVisible: boolean;
    try {
      // Wait up to 5s for the button to become visible
      await refreshButton.waitFor({ state: "visible", timeout: 5000 });
      isVisible = true;
      console.log("✅ Refresh All button is visible", isVisible);
    } catch {
      isVisible = false;
      console.log("❌ Refresh All button did not appear within 5s", isVisible);
    }
    const isEnabled = await refreshButton.isEnabled().catch(() => false);

    if (isVisible && isEnabled) {
      console.log("✅ Refresh All is ready");
      return true;
    } else {
      console.log("❌ Refresh All not ready again: somthing wrong.");
      return false;
    }
  }

  /**
   * ✅ Check if the "Refresh All" button is visible and enabled.
   *
   * This function performs the following steps:
   * 1. If a progress bar is visible, waits for it to finish.
   * 2. Confirms that the "Refreshed Successfully" popup appears, then closes it.
   * 3. Ensures that the "Refresh All" button is visible and ready for interaction.
   *
   * It returns `true` if the button is available and ready, otherwise `false`.
   *
   * @returns {Promise<boolean>} - `true` if the "Refresh All" button is visible and enabled,
   * otherwise `false`.
   */
  async getRefreshAllButtonVisibleAndEnabled(): Promise<boolean> {
    // Step 1: If a progress bar is visible, wait until it finishes.
    if (await this.progressBarIsVisible()) {
      const finished = await this.waitForProgressFinished();
      if (!finished) {
        console.warn("⚠️ Progress got stuck.");
        return false;
      }
      console.log("✅ Progress completed successfully.");

      // Step 2: Check if the success popup appears.
      const popupVisible = await this.popupRefreshedSuccessfullyIsVisible();
      if (!popupVisible) {
        console.log("❌ Popup 'Refreshed Successfully' doesn't appear.");
        return false;
      }
      console.log("✅ Popup 'Refreshed Successfully' is visible.");

      // Step 3: Try to close the popup.
      const popupClosed = await this.userClosePopupRefreshedSuccessfully();
      if (!popupClosed) {
        console.log("❌ User wasn't able to close the popup.");
        return false;
      }
      console.log("✅ User closed popup 'Refreshed Successfully'.");
    }

    // Step 4: Finally, verify that the "Refresh All" button is ready for interaction.
    const refreshReady = await this.ensureRefreshAllIsReady();
    if (refreshReady) {
      console.log("✅ User gets the 'Refresh All' button.");
      return true;
    } else {
      console.log("❌ User doesn't get the 'Refresh All' button.");
      return false;
    }
  }

  /**
   * ✅ Step: Click the "Refresh All" button inside the iframe.
   *
   * This function:
   * 1. Retrieves the target iframe using the existing `getFrame()` helper.
   * 2. Locates the "Refresh All" button inside the iframe using a constant selector and text.
   * 3. Clicks the button to trigger the refresh action.
   * 4. Returns `true` if the click was successful, otherwise `false`.
   *
   * @returns {Promise<boolean>} - `true` if the button was clicked successfully, otherwise `false`.
   */
  async clickRefreshAll(): Promise<boolean> {
    try {
      // Access the iframe where the button is located.
      const frame = await this.getFrame();

      // Locate the button using predefined constants (no hardcoded values).
      const refreshButton = frame.locator(this.refreshButtonSelector, { hasText: this.refreshButtonText });

      // Click the button and confirm success.
      await refreshButton.click();
      console.log("✅ Clicked 'Refresh All' successfully.");
      return true;
    } catch (error) {
      // Log error and return failure state if button interaction fails.
      console.error("❌ Failed to click 'Refresh All':", error);
      return false;
    }
  }
}
