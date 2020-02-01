import chalk from "chalk";
import minimist from "minimist";
import getBrowser from "./launch-browser";
import getPublic from "./commands/get-public";
import getSource from "./commands/get-source";
import backup from "./commands/backup";

(async () => {
  const argv = minimist(process.argv.slice(2));
  const commands = argv._;
  console.log(argv);

  if (commands.length === 0) {
    console.log(chalk.red("ERROR: We need a command"));
    process.exit();
  }

  const commandGetPublic = commands.some(c => c === "get-public");
  const commandGetSource = commands.some(c => c === "get-source");
  const commandBackup = commands.some(c => c === "backup");

  if (!commandGetPublic && !commandGetSource && !commandBackup) {
    console.log(
      chalk.red(
        "ERROR: incorrect command. We accept 'get-public' or 'get-source'"
      )
    );
    process.exit();
  }

  const browser = await getBrowser({ headless: true });
  const page = await browser.newPage();

  if (commandGetPublic) {
    await getPublic(argv, page);
  } else if (commandGetSource) {
    await getSource(argv, page);
  } else if (commandBackup) {
    await backup(argv, page);
  }

  await browser.close();
})();
