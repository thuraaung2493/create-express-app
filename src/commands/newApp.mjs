import { input } from '@inquirer/prompts';
import cp from 'child_process';
import { Command } from 'commander';
import figlet from 'figlet';
import { existsSync, mkdirSync } from 'node:fs';
import { rename, rm, unlink } from 'node:fs/promises';
import { join } from 'node:path';
import util from 'node:util';
import ora from 'ora';
import { errorLog, log } from '../logs.mjs';

const exec = util.promisify(cp.exec);

const currentPath = process.cwd();

const newApp = () => {
  const newAppCommand = new Command('new');

  newAppCommand
    .description('Create TypeScript-based Express application.')
    .usage('<name>')
    .argument('[name]', 'Application name')
    .action(action);

  return newAppCommand;
};

const action = async (arg) => {
  log(
    figlet.textSync('TS Express App', {
      horizontalLayout: 'fitted',
      width: 120,
    })
  );
  const name = await getAppName(arg);

  if (!name) {
    errorLog(`Error: Application can't create without name.`);
    process.exit(1);
  }

  log(`🚀 Creating ${name}...`);

  try {
    const appPath = createDir(name);

    await gitClone({ appName: name });

    await setupFiles(appPath);

    await installPackage(appPath);

    output(name);
  } catch (error) {
    errorLog(`Failed! error: ${error.message}`);
    await cleanup(name);
  }
};

const getAppName = async (name) => {
  try {
    return name
      ? name
      : await input({
          message: 'What is the name of your project?',
        });
  } catch (error) {
    errorLog('⚠ Cancelled.');
    process.exit(1);
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

const output = (name) => {
  log('Your application is ready 🥳', 'greenBright');
  log('Run your app with:');
  log(`       cd ${name}`);
  log(`       npm run dev`);
  log('npm run build', 'Project Build: ');
  log('npm start', 'Project Start: ');
};

export default newApp;
