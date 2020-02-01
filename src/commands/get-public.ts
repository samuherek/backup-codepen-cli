import { validateAndParsePublicArgs } from "../profile/validateAndParsePublicArgs";
import { executePensSettingsScraping } from "../profile/scrapePublicPens";
import saveJsonFile from "../utils/saveJsonFile";

export default async function getPublic(argv, page) {
  const parsedArgs = await validateAndParsePublicArgs(argv);
  const publicPens = await executePensSettingsScraping(
    parsedArgs.username,
    page
  );
  await saveJsonFile(
    parsedArgs.outputDir,
    publicPens,
    "scraped-public-data.json"
  );
}
