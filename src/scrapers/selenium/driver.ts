import { Builder, WebDriver } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome";
import "chromedriver";

let driver: WebDriver | null = null;

export type StartSeleniumOptions = {
  headless?: boolean;
  implicitWaitMs?: number;
  pageLoadTimeoutMs?: number;
  scriptTimeoutMs?: number;
};

export function isStarted(): boolean {
  return driver !== null;
}

export async function startSelenium(
  opts: StartSeleniumOptions = {}
): Promise<WebDriver> {
  if (driver) return driver;

  const {
    headless = true,
    implicitWaitMs = 0,
    pageLoadTimeoutMs = 60_000,
    scriptTimeoutMs = 30_000,
  } = opts;

  const options = new chrome.Options();

  if (headless) {
    options.addArguments("--headless=new");
  }

  options.addArguments("--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu");

  driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();

  if (implicitWaitMs > 0) {
    await driver.manage().setTimeouts({ implicit: implicitWaitMs });
  }

  await driver.manage().setTimeouts({
    pageLoad: pageLoadTimeoutMs,
    script: scriptTimeoutMs,
  });

  return driver;
}

export function getDriver(): WebDriver {
  if (!driver) {
    throw new Error("Selenium não iniciado. Chame startSelenium() antes.");
  }
  return driver;
}

export async function stopSelenium(): Promise<void> {
  if (!driver) return;

  try {
    await driver.quit();
  } finally {
    driver = null;
  }
}