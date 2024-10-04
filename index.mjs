#!/usr/bin/env node

import { Command } from 'commander';
import makeController from './src/commands/make/makeController.mjs';
import makeRepository from './src/commands/make/makeRepository.mjs';
import makeValidateSchema from './src/commands/make/makeValidateSchema.mjs';
import newApp from './src/commands/newApp.mjs';

const program = new Command();

program
  .name('expressor')
  .version('0.0.1')
  .description(
    'A powerful CLI tool for quickly scaffolding TypeScript-based Express applications, complete with built-in file management commands for streamlined development.'
  )
  .usage('command [options] [name]');

program.addCommand(newApp());
program.addCommand(makeController());
program.addCommand(makeValidateSchema());
program.addCommand(makeRepository());

program.parse(process.argv);
