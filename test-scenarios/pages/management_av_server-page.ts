import { Page, Frame, expect } from "@playwright/test";
import BasePage from "./base-page";

export default class ManagementPageAV extends BasePage {
  readonly upnpTabText = "UPnP AV Server";
  readonly anotherTab = "FTP Server";
  readonly iframeName = "mainFrame";
  readonly refreshText = "Refresh All";
  readonly progressBarSelector = "#progressbar";
  readonly successPopupText = "Refreshed Successfully.";

  constructor(page: Page) {
    super(page);
  }

  /** Helper: Get the actual Frame object from an iframe */
  private async getFrame(): Promise<Frame> {
    // Step 1: Find the iframe element on the page using its name
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

  /** Step: Open Management menu*/
  async openMenuManagement(): Promise<void> {
    // User is on the Home page, clicks "Management" menu
    const managementMenu = this.page.locator("span[datafld='management']");
    await managementMenu.waitFor({ state: "visible", timeout: 1500 });
    await managementMenu.click();
  }

  async openApplicationManagement(): Promise<void> {
    // User is on the menu Management, clicks "Application Management" submenu
    //const appMenuItem = this.page.locator("#desc_app");
    const appMenuItem = this.page.locator("#icon_app"); //clicks on icon instead of text
    await appMenuItem.waitFor({ state: "visible", timeout: 1500 });
    await appMenuItem.click();
  }
  /** Step: Open UPnP AV Server tab*/
  async openUpnpTabMenu(): Promise<void> {
    const tab = this.page.locator("#m_2", { hasText: this.upnpTabText });
    await tab.waitFor({ state: "visible", timeout: 1000 });
    await tab.click();
  }

  async openAnotherTabMenu(): Promise<boolean> {
    const tab = this.page.locator("#m_1", { hasText: this.anotherTab });
    try {
      await tab.waitFor({ state: "visible", timeout: 1000 });
      await tab.click();
      return true;
    } catch (error) {
      console.error("❌ Failed to open another tab:", error);
      return false;
    }
  }

  /** ✅ Check if the progress bar is visible and return true or false */
  async progressBarIsVisible(): Promise<boolean> {
    // Get the frame from the iframe
    const frame = await this.getFrame();
    // Locate the progress bar inside the frame
    const progressBar = frame.locator(this.progressBarSelector);
    // Check visibility and return the result
    const isVisible = await progressBar.isVisible().catch(() => false);
    if (isVisible) {
      console.log("⏳ Progress bar is visible.");
    } else {
      console.log("❌ Progress bar is not visible.");
    }
    return isVisible;
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

  /** User closes the popup*/

  async userClosePopupRefreshedSuccessfully(): Promise<boolean> {
    const okButton = this.page.locator("#popup_ok");
    let okVisible: boolean;

    try {
      await okButton.waitFor({ state: "visible", timeout: 2000 });
      okVisible = true;
      console.log("OK is visible");
    } catch {
      okVisible = false;
      console.log("OK is NOT visible");
    }

    const isEnabled = await okButton.isEnabled().catch(() => false);

    if (okVisible && isEnabled) {
      try {
        await okButton.click();
        console.log("OK button clicked successfully");
        return true;
      } catch (error) {
        console.error("Failed to click OK button:", error);
        return false;
      }
    } else {
      console.warn("OK button is not available");
      return false;
    }
  }

  async ensureRefreshAllReady(): Promise<boolean> {
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

  /** ✅ Check if Refresh All button is visible and enabled */
  async getRefreshAllButtonVisibleAndEnabled(): Promise<boolean> {
    if (await this.progressBarIsVisible()) {
      const finished = await this.waitForProgressFinished();
      if (!finished) {
        console.warn("⚠️ Progress got stuck.");
        return false;
      }
      console.log("✅ Progress completed successfully.");

      const popupVisible = await this.popupRefreshedSuccessfullyIsVisible();
      if (!popupVisible) {
        console.log("❌ Popup Refreshed Successfully doesn't appear.");
        return false;
      }
      console.log("✅ Popup Refreshed Successfully is visible.");

      const popupClosed = await this.userClosePopupRefreshedSuccessfully();
      if (!popupClosed) {
        console.log("❌ User wasn't able to close popup.");
        return false;
      }
      console.log("✅ User closes popup Refreshed Successfully.");
    }

    const refreshReady = await this.ensureRefreshAllReady();
    if (refreshReady) {
      console.log("✅ User gets the Refresh All button.");
      return true;
    } else {
      console.log("❌ User doesn't get the Refresh All button.");
      return false;
    }
  }

  /** ✅ Step: Click "Refresh All" inside the iframe and return success status */
  async clickRefreshAll(): Promise<boolean> {
    try {
      const frame = await this.getFrame(); // use existing helper
      const refreshButton = frame.locator("#refresh_button", { hasText: "Refresh All" });

      await refreshButton.click();
      console.log("✅ Clicked 'Refresh All' successfully.");
      return true;
    } catch (error) {
      console.error("❌ Failed to click 'Refresh All':", error);
      return false;
    }
  }
}
