import { ParsedArgs } from "minimist";
import parseInputPath from "../utils/parseInputPath";
import parseOutputPath from "../utils/parseOutputPath";

export async function validateAndParseBackupArgs(argv: ParsedArgs) {
  const { i: inputFilePath, o: outputDirPath } = argv;
  const inputPath = parseInputPath(inputFilePath);
  const outputDir = await parseOutputPath(outputDirPath);

  return {
    inputPath,
    outputDir
  };
}
