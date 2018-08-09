// @flow
const chalk = require('chalk');
const exportMozaikSchema = require('../../schema/export-schema.js');

type CmdOptions = {
  force: boolean,
  print: boolean,
};

module.exports = function exportSchema(
  options: Object,
  { force, print }: CmdOptions
) {
  exportMozaikSchema({ filename: options.schemaPath, force, print }).catch(
    error => {
      // eslint-disable-next-line
      console.error(chalk.red(error.message));
    }
  );
};
