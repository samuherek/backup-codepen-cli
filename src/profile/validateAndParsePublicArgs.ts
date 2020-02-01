import { ParsedArgs } from "minimist";
import parseUsername from "../utils/parseUsername";
import parseOutputPath from "../utils/parseOutputPath";

export async function validateAndParsePublicArgs(argv: ParsedArgs) {
  const { u, o: outputDirPath } = argv;
  const username = parseUsername(u);
  const outputDir = await parseOutputPath(outputDirPath);

  return {
    username,
    outputDir
  };
}
