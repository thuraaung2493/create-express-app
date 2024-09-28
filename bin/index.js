#!/usr/bin/env node

import chalk from 'chalk';
import { program } from 'commander';
import figlet from 'figlet';
import inquirer from 'inquirer';
import cp from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { rename, rm, unlink } from 'node:fs/promises';
import { join } from 'node:path';
import util from 'node:util';
import ora from 'ora';

const exec = util.promisify(cp.exec);

const currentPath = process.cwd();

const main = async (options) => {
  const { name } = options;

  if (!name) {
    errorLog(`Error: Application can't create without name.`);
    process.exit(1);
  }

  log(`Creating ${name}...`);

  try {
    const appPath = createDir(name);

    await gitClone({ appName: name });

    await setupFiles(appPath);

    await installPackage(appPath);

    logInfo(name);
  } catch (error) {
    errorLog(`Failed! error: ${error.message}`);
    await cleanup(name);
  }
};

const gitClone = async ({ appName }) => {
  const gitRepo = 'https://github.com/thuraaung2493/express-app-template.git';

  const spinner = ora('Downloading files ...').start();

  await exec(`git clone --depth 1 ${gitRepo} ${appName} --quiet`);

  spinner.succeed();
};

const setupFiles = async (appPath) => {
  const spinner = ora('Setting up files ...').start();
  const rmGit = rm(join(appPath, '.git'), { recursive: true, force: true });
  const rmPnpmLock = unlink(join(appPath, 'pnpm-lock.yaml'));
  const renameEnv = rename(
    join(appPath, '.env.example'),
    join(appPath, '.env')
  );

  Promise.all([rmGit, rmPnpmLock, renameEnv]);
  spinner.succeed();
};

const installPackage = async (appPath) => {
  const spinner = ora('Installing dependencies ...').start();

  await exec(`cd ${appPath} && npm install`);

  spinner.succeed();
};

const createDir = (appName) => {
  const appPath = join(currentPath, appName);

  if (!existsSync(appPath)) {
    mkdirSync(appPath);
  }

  return appPath;
};

const cleanup = async (appName) => {
  const appPath = join(currentPath, appName);

  await rm(appPath, { recursive: true, force: true });
};

const logInfo = (name) => {
  log('Your application is ready 🥳', 'greenBright');
  log('Run your app with:');
  log(`       cd ${name}`);
  log(`       npm run dev`);
  console.log(
    `${chalk.bold('Project Build: ', chalk.italic.cyanBright('npm run build'))}`
  );
  console.log(
    `${chalk.bold('Project Start: ', chalk.italic.cyanBright('npm run start'))}`
  );
};

const log = (message, color = 'cyanBright') => {
  console.log(chalk[color](message));
};

const errorLog = (message) => {
  console.log(chalk.redBright(message));
};

const getAppName = async (options) => {
  let name = options.name;

  if (name) {
    return name;
  }

  try {
    const input = await inquirer.prompt([
      { type: 'input', name: 'name', message: "What's your app name?" },
    ]);

    if (input.name) {
      return input.name;
    }

    errorLog(`Error: Application can't create without name.`);
    process.exit(1);
  } catch (error) {
    errorLog('Cancel.');
    process.exit(1);
  }
};

log(
  figlet.textSync('create-express-app', {
    horizontalLayout: 'fitted',
  })
);

program
  .version('0.0.1')
  .summary('Create Express App')
  .description(
    'A CLI tool for generating TypeScript-based Express applications, including route setup, JWT authentication, and Prisma ORM integration. Additionally, WebSocket support (via Socket.io) is available out of the box.'
  )
  .option('-n, --name <type>', 'Application name or project name.');

program.action(async (options) => {
  const name = await getAppName(options);

  await main({ name });
});

program.parse(process.argv);
