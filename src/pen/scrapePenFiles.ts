import chalk from "chalk";
import { Page } from "puppeteer";
import ora from "ora";
import tryToLoadPage from "../utils/tryToLoadPage";
import isUrl from "is-url";
import { PenConfig } from "../types";
import path, { ParsedPath } from "path";
import { saveSourceFile } from "../utils/saveSourceFile";

const SELECTORS = {
  pre: "pre"
};

const HTML = ["html", "haml", "markdown", "slim", "pug"];
const STYLES = ["css", "scss", "sass", "less", "stylus", "postcss"];
const SCRIPTS = ["js", "babel", "typescript", "coffeescript", "livescript"];

function queryCode(selectors: typeof SELECTORS) {
  const code = document.querySelector(selectors.pre);
  return code ? code.textContent : null;
}

async function collectFile(page: Page) {
  try {
    await page.waitForSelector(SELECTORS.pre, { timeout: 10000 });
  } catch {
    // If we get na error, the <pre> tag does not exist and it means
    // it has an empty file. It is the case for base files like HTML, CSS, JS.
    // WE just return empty string, because the file is empty anyway
    return "";
  }

  return await page.evaluate(queryCode, SELECTORS);
}

async function scrapeFile(url: string, page: Page) {
  if (!isUrl(url)) {
    console.log(chalk.red(`ERROR: ${url} is not a valid url`));
    process.exit();
  }

  await tryToLoadPage(url, page);

  return await collectFile(page);
}

function getFilename(ext: string) {
  if (HTML.some(e => e === ext)) {
    return "index";
  } else if (STYLES.some(e => e === ext)) {
    return "style";
  } else if (SCRIPTS.some(e => e === ext)) {
    return "script";
  } else {
    return "unknown-format";
  }
}

export async function executeFilesScraping(
  pens: PenConfig[],
  page: Page,
  outputDir: ParsedPath
) {
  const spinner = ora().start();
  let doneCount = 0;

  for (const pen of pens) {
    const percentDone =
      doneCount === 0 ? 0 : Math.round(pens.length / doneCount);
    const percentText = `${chalk.green(`${percentDone} % done`)}`;

    spinner.text = `${percentText} - Fetching files for "${pen.title}"`;
    doneCount += 1;

    for (const url of pen.sourceFiles) {
      const ext = url.split(".").pop();
      const data = await scrapeFile(url, page);

      if (data !== "") {
        const filename = getFilename(ext);
        const savePath = path.resolve(
          outputDir.dir,
          outputDir.base,
          pen.title,
          `${filename}.${ext}`
        );

        await saveSourceFile(savePath, data);
      }
    }

    const saveConfigPath = path.resolve(
      outputDir.dir,
      outputDir.base,
      pen.title,
      "config.json"
    );

    await saveSourceFile(saveConfigPath, JSON.stringify(pen));
  }

  spinner.stop();
}
