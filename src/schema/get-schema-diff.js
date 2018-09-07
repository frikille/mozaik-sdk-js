// @flow
const getProjectSchemaDiff = require('./../project/get-schema-changes/index.js');
const fs = require('fs');

type Options = {
  filename: string,
};

module.exports = async function getSchemaDiff({ filename }: Options) {
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
    throw new Error(errors[0].message);
  }

  if (!apiResult.data.project.schemaChanges) {
    throw new Error(
      'Could not compare schemas. Please check if your access token has project read permission!'
    );
  }

  // checking result errors
  errors = apiResult.data.project.schemaChanges.errors || [];
  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  const schemaDiff = apiResult.data.project.schemaChanges;

  return schemaDiff;
};
