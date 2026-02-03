#!/usr/bin/env node
import { Command } from 'commander'
import { createRequire } from 'module'
import { add } from './commands/add.js'
import { init } from './commands/init.js'
import { update } from './commands/update.js'

const require = createRequire(import.meta.url)
const packageJson = require('../package.json')

const program = new Command()

program
  .name('myoperator-ui')
  .description('CLI for adding myOperator UI components to your project')
  .version(packageJson.version)

program
  .command('init')
  .description('Initialize your project with myOperator UI')
  .action(init)

program
  .command('add')
  .description('Add a component to your project')
  .argument('[components...]', 'Components to add')
  .option('-a, --all', 'Add all available components', false)
  .option('-c, --category <category>', 'Add all components from a category (core, form, data, overlay, feedback, layout, custom)')
  .option('-y, --yes', 'Skip confirmation prompt', false)
  .option('-o, --overwrite', 'Overwrite existing files', false)
  .option('-p, --path <path>', 'Path to add components to', 'src/components/ui')
  .action(add)

program
  .command('update')
  .description('Update installed components to the latest version')
  .argument('[components...]', 'Components to update (leave empty to select)')
  .option('-y, --yes', 'Skip confirmation prompt', false)
  .option('-a, --all', 'Update all installed components', false)
  .option('-d, --dry-run', 'Show what would change without making changes', false)
  .option('-b, --backup', 'Create backup files before updating', false)
  .option('-p, --path <path>', 'Path to components directory', 'src/components/ui')
  .action(update)

program.parse()
