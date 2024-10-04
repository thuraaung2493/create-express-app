#!/usr/bin/env node

import { Command } from 'commander';
import figlet from 'figlet';
import makeController from './src/commands/make/makeController.mjs';
import makeRepository from './src/commands/make/makeRepository.mjs';
import makeValidateSchema from './src/commands/make/makeValidateSchema.mjs';
import newApp from './src/commands/newApp.mjs';
import { log } from './src/logs.mjs';

const program = new Command();

program
  .name('expressor')
  .version('0.0.1')
  .description(
    'A powerful CLI tool for quickly scaffolding TypeScript-based Express applications, complete with built-in file management commands for streamlined development.'
  )
  .usage('command [options] [name]')
  .action(() => {
    log(
      figlet.textSync('TS Express App', {
        horizontalLayout: 'fitted',
        width: 120,
      })
    );

    log('npx ts-expressor new <name>', 'Create New App - ');
    log('npx ts-expressor make:controller <name>', 'Create Controller - ');
    log('npx ts-expressor make:repository <name>', 'Create Repository - ');
    log('npx ts-expressor make:schema <name>', 'Create Validate Schema - ');
  });

program.addCommand(newApp());
program.addCommand(makeController());
program.addCommand(makeValidateSchema());
program.addCommand(makeRepository());

program.parse(process.argv);
