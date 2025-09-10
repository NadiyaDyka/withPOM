// ENUMS
export enum CheckoutPageHeaders {
  Information = "Checkout: Your Information",
  Overview = "Checkout: Overview",
  Complete = "Checkout: Complete!",
}

// DATES RELATED
export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// WAIT TIMES
export const WAIT_A_SECOND = 1 * 1000;
export const WAIT_AN_HOUR = 60 * 60 * 1000;
export const DEFAULT_EXPECT_TIMEOUT = 3 * 60 * 1000; // 3 minutes
export const DEFAULT_TEST_TIMEOUT = 10 * 60 * 1000; // 10 minutes
export const DEFAULT_TEST_RUN_TIMEOUT = 60 * 60 * 1000; // 60 minutes - For whole suite run
export const CHECK_VISIBILITY_TIMEOUT = 2 * 60 * 1000; // 2 minutes

// ERROR MESSAGES
export const LOCKOUT_ERROR_MESSAGE = "Epic sadface: Sorry, this user has been locked out.";
export const BAD_USERNAME_PASSWORD_ERROR_MESSAGE = "You entered an incorrect login name or password.Please try again.";
export const INCORRECT_CREDENTIALS_ERROR_MESSAGE = "You entered an incorrect login name or password.Please try again.";
// export const BASE_URL = "https://www.saucedemo.com/";
export const BASE_URL = "http://192.168.7.15/";

// STATUSES
export const NETWORK_IDLE = "networkidle";
export const STATE_ATTACHED = "attached";
export const STATE_VISIBLE = "visible";
export const STATE_HIDDEN = "hidden";

// BROWSERS

export const BROWSER_CHROMIUM = "chromium";
export const BROWSER_MSEDGE = "msedge";
export const BROWSER_WEBKIT = "webkit";
