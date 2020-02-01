import chalk from "chalk";
import path, { ParsedPath } from "path";
import isValidPath from "is-valid-path";

export default function parseInputPath(inputPath: string): ParsedPath {
  if (!isValidPath(inputPath)) {
    console.log(chalk.red("ERROR: invalid file path provided for -i"));
    process.exit();
  }

  const parsedPath = path.parse(inputPath);

  if (parsedPath.ext !== ".json") {
    console.log(chalk.red("ERROR: please provide a JSON file for -i"));
    process.exit();
  }

  return parsedPath;
}
