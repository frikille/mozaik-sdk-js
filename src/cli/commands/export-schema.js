// @flow

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
    err => {
      // eslint-disable-next-line
      console.log(err.message);
    }
  );
};
