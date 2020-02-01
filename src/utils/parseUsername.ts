import chalk from "chalk";

export default function parseUsername(username: string) {
  if (typeof username !== "string") {
    console.log(chalk.red("ERROR: arg -u needs the username string"));
    process.exit();
  }

  return username;
}
