// @flow
const getProjectSchema = require('./../project/get-schema/index.js');
const fs = require('fs');

type Options = {
  filename: string,
  force?: boolean,
  print?: boolean,
};

module.exports = async function exportSchema({
  filename,
  force,
  print,
}: Options) {
  const apiResult = await getProjectSchema();

  // checking GraphQL errors
  let errors = apiResult.errors || [];
  if (errors && errors.length > 0) {
    throw new Error(`Error getting the project schema: ${errors[0].message}`);
  }

  if (!apiResult.data.project) {
    throw new Error(
      'Could not download project schema. Please check if your access token has project read permission!'
    );
  }

  const schema = apiResult.data.project.schema;

  if (print) {
    process.stdout.write(schema);
    return;
  }

  let exists;
  try {
    fs.statSync(filename);
    exists = true;
  } catch (err) {
    exists = false;
  }

  if (!force && exists) {
    throw new Error(
      `${filename} already exists. Please delete the file or use --force to override it`
    );
  }

  fs.writeFileSync(filename, schema);
};
