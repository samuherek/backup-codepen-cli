import { Page } from "puppeteer";
import ora from "ora";
import chalk from "chalk";
import { PenMeta } from "../types";
import tryToLoadPage from "../utils/tryToLoadPage";
import tryToCatch from "try-to-catch";

const ROW_SELECTOR = ".item-in-list-view";
const PG_BUTTONS_SELECTOR = ".react-pagination-button span";

function getPublicProfileUrl(username: string): string {
  return `https://codepen.io/${username}/pens/public?grid_type=list`;
}

function queryPens(rowSelector: string): PenMeta[] {
  const rows = document.querySelectorAll(rowSelector);

  function getLink(parentNode: ChildNode): string {
    const possibleLinks = Array.from(parentNode.childNodes).filter(
      a => a.nodeName === "A"
    );
    return possibleLinks.length > 0
      ? (possibleLinks[0] as HTMLLinkElement).href
      : "";
  }

  function getId(link: string): string {
    return link.length > 0 ? link.split("/").pop() : "";
  }

  function collectPen(acc: PenMeta, child: ChildNode, i: number): PenMeta {
    // 1st td is title
    if (i === 0) {
      acc.title = child.textContent;
      acc.link = getLink(child);
      acc.id = getId(acc.link);
      // 3rd td date created
    } else if (i === 2) {
      acc.createdAt = child.textContent;
      // 4th td is date updated
    } else if (i === 3) {
      acc.updatedAt = child.textContent;
      // 5th td is stats
    } else if (i === 4) {
      // YES! There is "innerText" on the element;
      // @ts-ignore
      const [hearts, comments, views] = child.innerText.split("\n");
      acc.hearts = parseInt(hearts);
      acc.comments = parseInt(comments);
      acc.views = parseInt(views);
    }

    return acc;
  }

  // we are looping over "<td>s"
  return Array.from(rows).map(row =>
    Array.from(row.childNodes).reduce(collectPen, {} as PenMeta)
  );
}

async function collectPensFromPage(page: Page) {
  await page.waitForSelector(ROW_SELECTOR);
  return await page.evaluate(queryPens, ROW_SELECTOR);
}

function goToNextPage(pgButtonsSelector: string): boolean {
  const pgButtons = document.querySelectorAll(pgButtonsSelector);
  const lastPgBtn = Array.from(pgButtons).pop();

  const noNextButton = !lastPgBtn || lastPgBtn.textContent !== "Next Page";

  if (noNextButton) {
    return false;
  }

  (lastPgBtn as HTMLElement).click();

  return true;
}

export default async function scrapePagePens(
  page: Page
): Promise<{ pens: PenMeta[]; hasNextPage: boolean }> {
  const [error, pens] = await tryToCatch(collectPensFromPage, page);

  if (error) {
    console.log("\nERROR: in paginated page scrapgin", error.message);
    // TODO: really exiting???
    process.exit();
  }

  let hasNextPage = false;
  try {
    hasNextPage = await page.evaluate(goToNextPage, PG_BUTTONS_SELECTOR);
  } catch (e) {
    console.log("\nERROR: in trying to go to next page", e.message);
    // TODO: really exiting???
    process.exit();
  }

  // Wait for half a second to allow the page to fully load
  await page.waitFor(500);

  return {
    pens,
    hasNextPage
  };
}

export async function executePensSettingsScraping(
  username: string,
  page: Page
) {
  const spinner = ora("").start();
  spinner.text = "Loading profile";

  await tryToLoadPage(getPublicProfileUrl(username), page);

  spinner.text = `Scraping ${username} profile`;

  let scrapeNextPage = true;
  let i = 0;
  let data = [];

  while (scrapeNextPage && i < 50) {
    const { pens, hasNextPage } = await scrapePagePens(page);
    scrapeNextPage = hasNextPage;
    data = [...data, ...pens];
  }

  spinner.stop();

  return data;
}
