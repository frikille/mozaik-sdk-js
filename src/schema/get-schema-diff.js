// @flow
const getProjectSchemaDiff = require('./../project/get-schema-changes/index.js');
const fs = require('fs');
const logger = require('../utils/ora-logger.js');

type Options = {
  filename: string,
};

module.exports = async function getSchemaDiff({ filename }: Options) {
  logger.start('Getting schema diff');

  let schema;
  try {
    schema = fs.readFileSync(filename);
  } catch (err) {
    throw new Error(`failed to read ${filename}`);
  }

  const apiResult = await getProjectSchemaDiff({ schema: String(schema) });

  // checking GraphQL errors
  let errors = apiResult.errors || [];
  if (errors && errors.length > 0) {
    logger.fail(`Error comparing schemas: ${errors[0].message}`);
    throw new Error(`Error comparing schemas: ${errors[0].message}`);
  }

  if (!apiResult.data.project) {
    logger.fail();
    throw new Error(
      'Could not compare schemas. Please check if your access token has project read permission!'
    );
  }

  const schemaDiff = apiResult.data.project.schemaChanges;
  logger.succeed();

  return schemaDiff;
};
