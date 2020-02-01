import path, { ParsedPath } from "path";
import { PenMeta } from "../types";
import tryToCatch from "try-to-catch";
import { promises } from "fs";
import chalk from "chalk";
import tryCatch from "try-catch";

export async function loadJsonFile(parsedPath: ParsedPath): Promise<PenMeta[]> {
  const { dir, base } = parsedPath;

  const [error, file]: [Error, string] = await tryToCatch(
    promises.readFile,
    path.resolve(dir, base),
    "utf-8"
  );

  if (error) {
    console.log(chalk.red("ERROR: in arg -i: ", error.message));
    process.exit();
  }

  const [parseError, data]: [Error, PenMeta[]] = tryCatch(JSON.parse, file);

  if (parseError) {
    console.log(chalk.red("ERROR: in arg -i", parseError.message));
    process.exit();
  }

  return data;
}
