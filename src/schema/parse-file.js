// @flow
const fs = require('fs');
const parse = require('./parse.js');
module.exports = function(filename: string) {
  let schema;
  try {
    schema = fs.readFileSync(filename);
  } catch (err) {
    throw new Error(`failed to read ${filename}`);
  }
  return parse(schema);
};
