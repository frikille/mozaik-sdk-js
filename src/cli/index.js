const program = require('commander');
const initCommand = require('./commands/init.js');
const createSchema = require('./commands/create-schema.js');
const exportSchema = require('./commands/export-schema.js');
const diffSchema = require('./commands/diff-schema.js');
const updateSchemaCommand = require('./commands/update-schema.js');

const pkg = require('../../package.json');

const options = {
  schemaPath: 'mozaik-schema.graphql',
  configPath: '.mozaikrc',
};

program.version(pkg.version);

program
  .command('init')
  .description('Generates configs')
  .action(() => initCommand(options));

program
  .command('create')
  .description('Create schema by mozaik-schema.graphql')
  .action(() => createSchema(options));

program
  .command('export')
  .option('-f, --force', 'Override the mozaik-schema.graphql file if exists')
  .option(
    '-p, --print',
    'Print the schema to the output instead of writing it to a file'
  )
  .description('Export schema to mozaik-schema.graphql')
  .action(cmd => exportSchema(options, cmd));

program
  .command('diff')
  .description('Compare the local and remote schemas')
  .action(() => diffSchema(options));

program
  .command('apply')
  .option('-f, --force', 'Automatically apply all changes (no prompt)')
  .description('Apply the local schema changes')
  .action(cmd => updateSchemaCommand(options, cmd));

program
  .command('version')
  .description('Displays version')
  .action(() => console.log(pkg.version)); // eslint-disable-line

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
