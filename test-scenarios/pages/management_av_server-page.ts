import { Page, Frame, expect, Locator } from "@playwright/test";
import BasePage from "./base-page";
import { XMLParser } from "fast-xml-parser";

export default class ManagementPageAV extends BasePage {
  readonly upnpTabText = "UPnP AV Server";
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
}
