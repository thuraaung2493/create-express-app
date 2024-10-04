import chalk from 'chalk';

export const log = (message, prefix = '') => {
  console.log(`${prefix}${chalk.cyanBright(message)}`);
};

export const errorLog = (message) => {
  console.log(chalk.redBright(message));
};

export const info = ({ message, type = 'info' }) => {
  const prefix = type === 'info' ? chalk.bgBlue('INFO') : chalk.bgRed('ERROR');
  console.log(`${prefix} ${message}`);
};
