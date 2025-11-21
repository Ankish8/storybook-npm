#!/usr/bin/env node
import { Command } from 'commander'
import { add } from './commands/add.js'
import { init } from './commands/init.js'

const program = new Command()

program
  .name('myoperator-ui')
  .description('CLI for adding myOperator UI components to your project')
  .version('0.0.1')

program
  .command('init')
  .description('Initialize your project with myOperator UI')
  .action(init)

program
  .command('add')
  .description('Add a component to your project')
  .argument('[components...]', 'Components to add')
  .option('-y, --yes', 'Skip confirmation prompt', false)
  .option('-o, --overwrite', 'Overwrite existing files', false)
  .option('-p, --path <path>', 'Path to add components to', 'src/components/ui')
  .action(add)

program.parse()
