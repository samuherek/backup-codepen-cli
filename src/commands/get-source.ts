import { ParsedArgs } from "minimist";
import { Page } from "puppeteer";
import { validateAndParseSourceArgs } from "../pen/validateAndParseSourceArgs";
import { loadJsonFile } from "../utils/loadJsonFile";
import scrapePenSettings from "../pen/scrapePenSettings";
import { executeFilesScraping } from "../pen/scrapePenFiles";
import saveJsonFile from "../utils/saveJsonFile";

export default async function getSource(argv: ParsedArgs, page: Page) {
  const parsedArgs = await validateAndParseSourceArgs(argv);
  const data = await loadJsonFile(parsedArgs.inputPath);
  const scrapedPens = [];

  for (const pen of data) {
    const penWithSettings = await scrapePenSettings(pen, page);
    scrapedPens.push(penWithSettings);
  }

  await saveJsonFile(
    parsedArgs.outputDir,
    scrapedPens,
    "scraped-with-settings-data.json"
  );
}
