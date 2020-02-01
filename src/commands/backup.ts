import { ParsedArgs } from "minimist";
import { Page } from "puppeteer";
import { validateAndParseBackupArgs } from "../backup/validateAndParseBackupArgs";
import { loadJsonFile } from "../utils/loadJsonFile";
import { PenConfig } from "../types";
import { executeFilesScraping } from "../pen/scrapePenFiles";

export default async function backup(argv: ParsedArgs, page: Page) {
  const parsedArgs = await validateAndParseBackupArgs(argv);
  const data = (await loadJsonFile(parsedArgs.inputPath)) as PenConfig[];
  await executeFilesScraping(data, page, parsedArgs.outputDir);
}
