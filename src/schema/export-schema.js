// @flow
const getProjectSchema = require('./../project/get-schema/index.js');
const fs = require('fs');
const logger = require('../utils/ora-logger.js');

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
  logger.start('Downloading schema');
  const apiResult = await getProjectSchema();

  // checking GraphQL errors
  let errors = apiResult.errors || [];
  if (errors && errors.length > 0) {
    logger.fail(`Error getting the project schema: ${errors[0].message}`);
    throw new Error(`Error getting the project schema: ${errors[0].message}`);
  }

  if (!apiResult.data.project) {
    logger.fail();
    throw new Error(
      'Could not download project schema. Please check if your access token has project read permission!'
    );
  }

  const schema = apiResult.data.project.schema;
  logger.succeed();

  if (print) {
    // eslint-disable-next-line
    console.log(schema);
    return;
  }

  logger.start(`Writing schema to ${filename}`);

  let exists;
  try {
    fs.statSync(filename);
    exists = true;
  } catch (err) {
    exists = false;
  }

  if (!force && exists) {
    const message = `${filename} already exists. Please delete the file or use --force to override it`;
    logger.fail();
    throw new Error(message);
  }

  fs.writeFileSync(filename, schema);

  // eslint-disable-next-line
  logger.succeed();
};
