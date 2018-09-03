// @flow
const importSchemaMutation = require('./../project/import-schema/index.js');
const fs = require('fs');

type Options = {
  filename: string,
};

module.exports = async function importSchema({ filename }: Options) {
  let schema;
  try {
    schema = fs.readFileSync(filename);
  } catch (err) {
    throw new Error(`failed to read ${filename}`);
  }

  const apiResult = await importSchemaMutation({
    schema: String(schema),
  });

  // checking GraphQL errors
  let errors = apiResult.errors || [];
  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  // checking result errors
  errors = apiResult.data.importSchema.errors || [];
  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }
};
