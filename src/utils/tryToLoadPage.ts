import chalk from "chalk";
import { Page } from "puppeteer";

export default async function tryToLoadPage(url: string, page: Page) {
  let tries = 3;

  while (tries > 0) {
    let isError = false;

    try {
      await page.goto(url, { waitUntil: "networkidle2" });
      tries = 0;
    } catch {
      tries -= 1;
      isError = true;
    }

    if (isError && tries === 0) {
      console.log(chalk.red("ERROR: failed to load ", url));
    }
  }
}
