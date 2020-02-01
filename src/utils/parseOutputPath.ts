import tryToCatch from "try-to-catch";
import { Stats } from "fs";
import path, { ParsedPath } from "path";
import { promises } from "fs";
import chalk from "chalk";

export default async function parseOutputPath(
  outputDir: string
): Promise<ParsedPath> {
  const parsedPath = path.parse(outputDir);

  const [error, stats]: [Error, Stats] = await tryToCatch(
    promises.lstat,
    path.resolve(parsedPath.dir, parsedPath.base)
  );

  if (error) {
    console.log(chalk.red("ERROR: the -u path ", error.message));
    process.exit();
  }

  if (!stats || !stats.isDirectory()) {
    console.log(chalk.red("ERROR: the -u path is not an existing directory"));
    process.exit();
  }

  return parsedPath;
}
