import chalk from "chalk";
import tryToCatch from "try-to-catch";
import write from "write";

export async function saveSourceFile(savePath: string, data: string) {
  const [error] = await tryToCatch(write, savePath, data);

  if (error) {
    console.log(
      chalk.red(
        `ERROR: in saving source file ${savePath.split("/").pop()}\n`,
        error.message
      )
    );
  }
}
