// @flow
const updateSchemaMutation = require('./../project/update-schema/index.js');

const fs = require('fs');

type Options = {
  filename: string,
  applyDangerousChanges: boolean,
};

module.exports = async function updateSchema({
  filename,
  applyDangerousChanges,
}: Options) {
  let schema;
  try {
    schema = fs.readFileSync(filename);
  } catch (err) {
    throw new Error(`failed to read ${filename}`);
  }

  const apiResult = await updateSchemaMutation({
    schema: String(schema),
    applyDangerousChanges,
  });

  // checking GraphQL errors
  let errors = apiResult.errors || [];
  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  // checking result errors
  errors = apiResult.data.updateSchema.errors || [];
  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }
};
