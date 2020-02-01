import tryToCatch from "try-to-catch";
import { promises } from "fs";
import path, { ParsedPath } from "path";
import chalk from "chalk";
import tryCatch from "try-catch";

export default async function saveJsonFile(
  pathVal: ParsedPath,
  data: any,
  name: string
) {
  const [stringifyError, string] = tryCatch(JSON.stringify, data);

  if (stringifyError) {
    console.log(chalk.red("ERROR:", stringifyError.message));
    process.exit();
  }

  const [error] = await tryToCatch(
    promises.writeFile,
    path.resolve(pathVal.dir, pathVal.base, name),
    string
  );

  if (error) {
    console.log(chalk.red("ERROR: ", error.message));
    process.exit();
  }
}
