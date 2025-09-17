import { Page, Frame, expect } from "@playwright/test";
import BasePage from "./base-page";
import { XMLParser } from "fast-xml-parser";

export default class ManagementPage extends BasePage {
  readonly upnpTabText = "UPnP AV Server";
  readonly iframeName = "mainFrame";
  readonly refreshText = "Refresh All";
  readonly progressBarSelector = "#progressbar";
  readonly successPopupText = "Refreshed Successfully.";

  constructor(page: Page) {
    super(page);
  }

  /** Step: Open Management → Application Management menu*/
  async openApplicationManagement(): Promise<void> {
    // Click "Management" menu
    const managementMenu = this.page.locator("span[datafld='management']");
    await managementMenu.waitFor({ state: "visible", timeout: 1500 });
    await managementMenu.click();

    // Click "Application Management" submenu
    //const appMenuItem = this.page.locator("#desc_app");
    const appMenuItem = this.page.locator("#icon_app");

    await appMenuItem.waitFor({ state: "visible", timeout: 1500 });
    await appMenuItem.click();
  }

  async openUpnpTabMenu(): Promise<void> {
    const tab = this.page.locator("#m_2", { hasText: this.upnpTabText });
    await tab.waitFor({ state: "visible", timeout: 1000 });
    await tab.click();
  }

  async waitForProgressFinishedAndClick(): Promise<void> {
    const frame = await this.getFrame(); // iframe for progress bar
    const progressBar = frame.locator(this.progressBarSelector);
    // Check if progress bar is visible
    let progressVisible = false;
    try {
      await progressBar.waitFor({ state: "visible", timeout: 500 });
      progressVisible = true;
    } catch {
      progressVisible = false;
    }
    //const progressVisible = await progressBar.isVisible({ timeout: 500 }).catch(() => false);

    if (progressVisible) {
      let barScoreStr = await progressBar.getAttribute("aria-valuenow");
      let barScore = parseInt(barScoreStr ?? "0", 10);
      console.log("Progress bar visible with score:", barScore);

      if (barScore < 100 && barScore >= 0) {
        console.log(`Progress bar at ${barScore}%, not yet complete`);
        for (let i = 0; i < 300 && barScore < 100; i++) {
          // Loop to wait for progress to reach 100%
          await this.page.waitForTimeout(1000);
          barScoreStr = await progressBar.getAttribute("aria-valuenow");
          barScore = parseInt(barScoreStr ?? "0", 10);
          console.log("Current progress bar score:", barScore);
        }
        if (barScore < 100) {
          expect(false, "Progress bar got stuck").toBe(true);
        }
      }

      // progress already 100%
      console.log("Progress bar at 100%, waiting for popup");
      const popupText = this.page.getByText(this.successPopupText, { exact: true });
      //can't be use
      let popupVisible: boolean;
      //popupVisible = await popupText.isVisible({ timeout: 500 }).catch(() => false);
      try {
        await popupText.waitFor({ state: "visible", timeout: 6000 });
        popupVisible = true;
        console.log("Popup is visible");
      } catch {
        popupVisible = false;
        console.log("Popup is NOT visible");
      }

      if (popupVisible) {
        console.log("Popup detected, clicking OK ✅");
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

        if (okVisible && (await okButton.isEnabled().catch(() => false))) {
          await okButton.click();
        } else {
          expect(false, "OK button is not available").toBe(true);
        }
      } else {
        expect(false, "Popup is not visible").toBe(true);
      }
    } else {
      console.log("No progress bar visible");
    }
  }

  async ensureRefreshAllReady1(): Promise<void> {
    let frame = await this.getFrame();
    let refreshButton = frame.getByText("Refresh All");
    // Wait up to 5s for the button to appear
    //let isVisible = await refreshButton.isVisible().catch(() => false);
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
   
    if (!isVisible) {
      console.log("❌ Refresh All is not visible → check for progress to finish");
      const progressBar = frame.locator(this.progressBarSelector);
      var isPBVisible = await progressBar.isVisible().catch(() => false);
      if (isPBVisible) {
        console.log("⏳ Progress bar is visible, waiting for it to finish");
        await this.waitForProgressFinishedAndClick();
        // Re-query button after DOM update
        const refreshButtonUpdated = frame.locator("#refresh_button");
        isVisible = await refreshButtonUpdated.isVisible().catch(() => false);
      } else {
        console.log("❌ Progress bar is not visible → something is wrong.");
        expect(false, "Neither Refresh All nor Progress Bar is visible").toBe(true);
      }
    }

    const isEnabled = await refreshButton.isEnabled().catch(() => false);

    if (isVisible && isEnabled) {
      console.log("✅ Refresh All is ready → clicking");
      await this.clickRefreshAll();
      await this.waitForProgressFinishedAndClick();
    } else {
      console.log("❌ Refresh All not ready again: somthing wrong.");
    }
  }

  /** Step: Click "Refresh All" inside the iframe */
  async clickRefreshAll(): Promise<void> {
    const frame = await this.getFrame(); // use existing helper

    // Locate the button inside the iframe
    const refreshButton = frame.locator("#refresh_button", { hasText: "Refresh All" });

    // Click the button
    await refreshButton.click();
  }

  /** Step: Wait for the progress bar to appear */
  async waitForProgressBarVisible(): Promise<void> {
    const frame = await this.getFrame();
    const progressBar = frame.locator(this.progressBarSelector);
    await expect(progressBar).toBeVisible();
  }

  /** Soft wait and click "Refreshed Successfully" popup if it appears */

  async handleSuccessPopup(retries = 10, intervalMs = 1000): Promise<void> {
    // Loop will retry a given number of times (default: 10 retries)
    // This is needed because the popup may not appear immediately after the progress bar completes.
    for (let i = 0; i < retries; i++) {
      // Try to locate the popup text "Refreshed Successfully"
      const popupText = this.page.getByText(this.successPopupText, { exact: true });

      // Check if the popup text is visible
      // `.catch(() => false)` ensures that if the element is not found,
      // we don't throw an exception but simply treat it as "not visible yet".
      if (await popupText.isVisible().catch(() => false)) {
        console.log("✅ Success popup appeared");

        // Locate the "OK" button inside the popup
        const okButton = this.page.locator("#popup_ok");

        // Check if the "OK" button is visible
        if (await okButton.isVisible().catch(() => false)) {
          // If visible, click it to close the popup and exit the method
          await okButton.click();
          console.log("👉 Clicked 'OK' on the success popup");
          return;
        }
      }

      // If the popup is not visible yet, wait a short interval before retrying
      // Instead of using a fixed `waitForTimeout`, this keeps the test responsive
      // and allows the popup to be detected as soon as it appears.
      await this.page.waitForFunction((delay) => new Promise((res) => setTimeout(res, delay)), intervalMs);
      console.log(`⏳ Waiting for popup... attempt ${i + 1}/${retries}`);
    }

    // If the loop finishes without finding the popup, log a warning but do not fail the test
    console.warn("⚠️ Success popup did not appear after all retries");
  }

  /** Network-based wait for progress response */
  private async _waitForProgressResponse(check: (percent: number, complete: number) => boolean) {
    await this.page.waitForResponse(
      async (response) => {
        if (!response.url().includes("/xml/upnp_prescan.xml")) return false;

        const text = await response.text();

        // Parse XML using fast-xml-parser
        const parser = new XMLParser();
        const jsonObj = parser.parse(text);

        // Extract <percent> and <complete> values
        const percent = parseInt(jsonObj.percent ?? "0", 10);
        const complete = parseInt(jsonObj.complete ?? "0", 10);

        return check(percent, complete);
      },
      { timeout: 60000 }
    );
  }

  /** Wait while progress is running (>0 but <100) */
  async waitForProgressBarProgressNetwork(): Promise<void> {
    // Keeps track of the last progress value we saw. Ensure progress never goes backward
    let lastPercent = 0;
    await this._waitForProgressResponse((percent) => {
      //Calls the helper function. That helper listens to network responses (upnp_prescan.xml),
      // extracts <percent>, and passes it to this check function.
      //It keeps waiting until check(...) returns true.
      if (percent < lastPercent) throw new Error(`Progress regressed: ${lastPercent}% -> ${percent}%`);
      lastPercent = percent;
      //keep waiting as long as progress is between 1% and 99%.
      //stop when it’s 0% (not started) or 100% (finished).
      return percent > 0 && percent < 100;
    });
  }

  /** Wait until progress reaches 100% via network */
  async waitForProgressBarCompleteNetwork(): Promise<void> {
    await this._waitForProgressResponse((percent, complete) => percent === 100 && complete === 1);
  }

  /** Helper: Get the actual Frame object from iframe */
  private async getFrame(): Promise<Frame> {
    // Use `locator`, NOT `frameLocator`
    const iframeLocator = this.page.locator(`iframe[name="${this.iframeName}"]`);
    //let refreshButton
    await expect(iframeLocator).toBeVisible();

    const frame: Frame | null = await iframeLocator.elementHandle().then((handle) => handle?.contentFrame() ?? null);

    if (!frame) throw new Error("iframe not found");

    return frame; // This is a real Frame object
  }
}
