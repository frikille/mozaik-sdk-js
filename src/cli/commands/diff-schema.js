// @flow
const getSchemaDiff = require('../../schema/get-schema-diff.js');
const printSchemaDiff = require('../../schema/print-schema-diff.js');
const logger = require('../../utils/ora-logger.js');

module.exports = async function diffSchema(options: Object) {
  getSchemaDiff({ filename: options.schemaPath })
    .then(schemaDiff => {
      printSchemaDiff(schemaDiff);
    })
    .catch(err => {
      logger.fail(`Error getting schema changes: ${err.message}`);
      process.exit(1);
    });
};
