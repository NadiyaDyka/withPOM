import { test as base, createBdd } from "playwright-bdd";
import BasePage from "../pages/base-page";
import LoginPage from "../pages/login-page";
import HomePage from "../pages/home-page";
import BaseApi from "../api/pages/base-api";
import LoginApi from "../api/pages/login-api";
import fs from "fs";
import path from "path";
import { Page } from "playwright";
import Utils from "../utils/utils";
export * from "@playwright/test";
import { LOGGER } from "./Logger";

type MyFixtures = {
  basePage: BasePage;
  loginPage: LoginPage;
  homePage: HomePage;
  baseApi: BaseApi;
  loginApi: LoginApi;
  utils: Utils;
  sharedData: {
    /*Shared data goes here*/ generatedName: string;
  };
};

export const test = base.extend<MyFixtures>({
  utils: new Utils(),
  sharedData: async ({}, use) => {
    const data = {
      /*Data goes here*/ generatedName: "",
    };
    use(data);
  },
  // GUI Pages
  basePage: async ({ page }, use) => use(new BasePage(page)),
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  homePage: async ({ page }, use) => use(new HomePage(page)),
  // API endpoints
  // baseApi: async ({ request }, use) => use(new BaseApi(request)),
  loginApi: async ({ request }, use) => use(new LoginApi(request)),

  // Use the same storage state for all tests in this worker
  storageState: ({ workerStorageState }, use) => use(workerStorageState),
  workerStorageState: [
    async ({ browser }, use) => {
      const id = test.info().parallelIndex;
      const fileName = path.resolve(test.info().project.outputDir, `.auth/${id}.json`);
      if (fs.existsSync(fileName)) {
        // Reuse existing authentication state, if any.
        await use(fileName);
        return;
      }

      // Important: make sure we authenticate in a clean environment by unsetting storage state.
      const page = await browser.newPage({ storageState: undefined });
      //Perform Authetication Steps
      //... Steps go here
      await page.context().storageState({ path: fileName });
      await page.close();
      await use(fileName);
    },
    { scope: "worker" },
  ],
});

export const cleanTest = base.extend<MyFixtures>({
  utils: new Utils(),
  sharedData: async ({}, use) => {
    const data = {
      /*Data goes here*/ generatedName: "",
    };
    use(data);
  },
  // GUI Pages
  basePage: async ({ page }, use) => use(new BasePage(page)),
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  homePage: async ({ page }, use) => use(new HomePage(page)),
  // API endpoints
  // baseApi: async ({ request }, use) => use(new BaseApi(request)),
  loginApi: async ({ request }, use) => use(new LoginApi(request)),

  // It will be useed the NEW storage state for every tests
});

export const { Given, When, Then, Before, BeforeAll, After, AfterAll } = createBdd(test);

// This helps with looking for fonts
export async function elementsWithNotAcceptedText(page: Page, expectedFonts: string[]) {
  return await page.evaluate(
    ([expectedFonts, LOGGER]) => {
      function getElementXpath(el: Element): string {
        if (el.id) {
          return `//*[@id="${el.id}"]`;
        }
        const parts: string[] = [];
        while (el && el.nodeType === Node.ELEMENT_NODE) {
          let index = 1,
            sibling: ChildNode | null = el.previousElementSibling;
          while (sibling) {
            if (sibling.nodeType === Node.ELEMENT_NODE && sibling.nodeName === el.nodeName) {
              index++;
            }
            sibling = sibling.previousSibling;
          }
          parts.unshift(`${el.nodeName.toLowerCase()}[${index}]`);
          el = el.parentElement;
        }
        return `/${parts.join("/")}`;
      }
      const elements = Array.from(document.querySelectorAll("*"));
      const results: { text: string; fontFamily: string; xpath: string }[] = [];
      for (const el of elements) {
        try {
          const text = (el as HTMLElement).innerText.trim();
          const style = window.getComputedStyle(el);
          const isVisible =
            style.display !== "none" &&
            style.visibility !== "hidden" &&
            style.opacity !== "0" &&
            (el as HTMLElement).offsetHeight > 0 &&
            (el as HTMLElement).offsetWidth > 0 &&
            el.getClientRects().length > 0;
          const hasDirectText = Array.from(el.childNodes).some(
            (node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim
          );
          if (text && isVisible && hasDirectText) {
            const fontFamilyRaw = style.fontFamily;
            const Fonts = fontFamilyRaw.split(",").map((f) => f.replace(/["']/g, "").trim().toLowerCase());
            if (Fonts[0] !== expectedFonts[0].toLowerCase()) {
              results.push({ text: text, fontFamily: Fonts[0], xpath: getElementXpath(el) });
            }
          }
        } catch (err) {
          LOGGER.error(`error on element: ${el}`, err);
        }
      }
    },
    [expectedFonts, LOGGER]
  );
}
