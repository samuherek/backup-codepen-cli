import puppeteer from "puppeteer";

export default async function getBrowser(
  settings?: Object
): Promise<puppeteer.Browser> {
  const browser = await puppeteer.launch({ headless: true, ...settings });
  return browser;
}
