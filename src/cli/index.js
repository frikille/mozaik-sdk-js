const program = require('commander');
const initCommand = require('./commands/init.js');
const importSchema = require('./commands/import-schema.js');
const exportSchema = require('./commands/export-schema.js');
const diffSchema = require('./commands/diff-schema.js');
const updateSchemaCommand = require('./commands/update-schema.js');

const pkg = require('../../package.json');

const options = {
  schemaPath: 'mozaik-schema.graphql',
  configPath: '.mozaikrc',
};

// Code is from here:
// https://github.com/tj/commander.js/issues/764#issuecomment-399739989
program.Command.prototype.forwardSubcommands = function() {
  var self = this;
  var listener = function(args = [], unknown = []) {
    var parsed = self.parseOptions(unknown);
    if (parsed.args.length) {
      args = parsed.args.concat(args);
    }
    unknown = parsed.unknown;

    // Output help if necessary
    if (args.length === 0) {
      self.outputHelp();
      process.exit(0);
    }

    self.parseArgs(args, unknown);
  };

  if (this._args.length > 0) {
    throw new Error(
      'forwardSubcommands cannot be applied to command with explicit args'
    );
  }

  var parent = this.parent || this;
  var name = parent === this ? '*' : this._name;
  parent.on('command:' + name, listener);
  if (this._alias) {
    parent.on('command:' + this._alias, listener);
  }
  return this;
};

program.version(pkg.version);

const schemaCommand = program
  .command('schema')
  .description('Manage your schema')
  .forwardSubcommands();

schemaCommand
  .command('import')
  .description('Import schema from mozaik-schema.graphql')
  .action(() => importSchema(options));

schemaCommand
  .command('export')
  .option('-f, --force', 'Override the mozaik-schema.graphql file if exists')
  .option(
    '-p, --print',
    'Print the schema to the output instead of writing it to a file'
  )
  .description('Export schema to mozaik-schema.graphql')
  .action(cmd => exportSchema(options, cmd));

schemaCommand
  .command('diff')
  .description('Compare the local and remote schemas')
  .action(() => diffSchema(options));

schemaCommand
  .command('apply')
  .option('-f, --force', 'Automatically apply all changes (no prompt)')
  .description('Apply the local schema changes')
  .action(cmd => updateSchemaCommand(options, cmd));

program
  .command('init')
  .description('Generates configs')
  .action(() => initCommand(options));

program
  .command('version')
  .description('Displays version')
  .action(() => console.log(pkg.version)); // eslint-disable-line

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
