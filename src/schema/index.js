const exportSchema = require('./export-schema.js');
const getSchemaDiff = require('./get-schema-diff.js');
const importSchema = require('./import-schema.js');
const printSchemaDiff = require('./print-schema-diff.js');
const updateSchema = require('./update-schema.js');

const schema = {
  exportSchema,
  getSchemaDiff,
  importSchema,
  printSchemaDiff,
  updateSchema,
};

module.exports = schema;
