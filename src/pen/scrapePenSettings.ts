import { PenMeta, PenConfig } from "../types";
import { Page } from "puppeteer";
import ora from "ora";
import tryToLoadPage from "../utils/tryToLoadPage";

const SELECTORS = {
  htmlPreprocessor: "#settings-html #html-preprocessor",
  htmlHead: "#settings-html #head-content",
  cssPreprocessor: "#settings-css #css-preprocessor",
  cssResources:
    "#settings-css #css-external-resources .external-resource-url-row input",
  jsPreprocessor: "#settings-js #js-preprocessor",
  jsResources:
    "#settings-js #js-external-resources .external-resource-url-row input",
  sourceFiles: ".share-static a"
};

function querySettings(selectors: typeof SELECTORS) {
  function getAndFilterInputResources(inputs: NodeListOf<HTMLInputElement>) {
    return Array.from(inputs)
      .map(i => i.value)
      .filter(i => i !== "");
  }

  function getHtmlSettings() {
    const p: HTMLInputElement = document.querySelector(
      selectors.htmlPreprocessor
    );
    const h: HTMLTextAreaElement = document.querySelector(selectors.htmlHead);

    return {
      preprocessor: p ? p.value : "none",
      head: h ? h.value : ""
    };
  }

  function getCssSettings() {
    const p: HTMLInputElement = document.querySelector(
      selectors.cssPreprocessor
    );
    const r: NodeListOf<HTMLInputElement> = document.querySelectorAll(
      selectors.cssResources
    );

    return {
      preprocessor: p ? p.value : "none",
      resources: getAndFilterInputResources(r)
    };
  }

  function getJsSettings() {
    const p: HTMLInputElement = document.querySelector(
      selectors.jsPreprocessor
    );
    const r: NodeListOf<HTMLInputElement> = document.querySelectorAll(
      selectors.jsResources
    );

    return {
      preprocessor: p ? p.value : "none",
      resources: getAndFilterInputResources(r)
    };
  }

  const html = getHtmlSettings();
  const css = getCssSettings();
  const js = getJsSettings();

  return {
    html,
    css,
    js
  };
}

async function collectSettingsFromPage(page: Page) {
  await page.waitForSelector(SELECTORS.htmlPreprocessor);
  return await page.evaluate(querySettings, SELECTORS);
}

function querySourceFiles(selectors: typeof SELECTORS) {
  function getLinkHrefs(links: NodeListOf<HTMLLinkElement>) {
    return Array.from(links).map(l => l.href);
  }

  const links: NodeListOf<HTMLLinkElement> = document.querySelectorAll(
    selectors.sourceFiles
  );
  console.log(links);
  return getLinkHrefs(links);
}

async function collectSourceFilesFromPag(page: Page) {
  await page.waitForSelector(SELECTORS.sourceFiles);
  return await page.evaluate(querySourceFiles, SELECTORS);
}

export default async function scrapePenSettings(
  pen: PenMeta,
  page: Page
): Promise<PenConfig> {
  const spinner = ora(`Loading and scraping ${pen.title}`).start();

  const nextPen = { ...pen, settings: {}, sourceFiles: [] };

  await tryToLoadPage(pen.link, page);

  const settings = await collectSettingsFromPage(page);
  const sourceFiles = await collectSourceFilesFromPag(page);

  nextPen.settings = settings;
  nextPen.sourceFiles = sourceFiles;

  spinner.stop();
  return nextPen as PenConfig;
}
