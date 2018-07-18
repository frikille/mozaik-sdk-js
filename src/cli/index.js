const program = require('commander');
const initCommand = require('./commands/init.js');
const createSchema = require('./commands/create-schema.js');

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
  .command('version')
  .description('Displays version')
  .action(() => console.log(pkg.version)); // eslint-disable-line

program.parse(process.argv);
