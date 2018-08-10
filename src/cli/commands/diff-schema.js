// @flow
const getSchemaDiff = require('../../schema/get-schema-diff.js');
const printSchemaDiff = require('../../schema/print-schema-diff.js');

module.exports = async function diffSchema(options: Object) {
  const schemaDiff = await getSchemaDiff({ filename: options.schemaPath });
  printSchemaDiff(schemaDiff);
};
