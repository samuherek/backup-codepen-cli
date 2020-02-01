import { ParsedArgs } from "minimist";
import parseOutputPath from "../utils/parseOutputPath";
import parseInputPath from "../utils/parseInputPath";

export async function validateAndParseSourceArgs(argv: ParsedArgs) {
  const { i: inputFilePath, o: outputDirPath } = argv;
  const inputPath = parseInputPath(inputFilePath);
  const outputDir = await parseOutputPath(outputDirPath);

  return {
    inputPath,
    outputDir
  };
}
