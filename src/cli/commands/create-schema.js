const fs = require('fs');
const fileExists = require('../../utils/file-exists');
const createMozaikSchema = require('../../schema/create-schema.js');

module.exports = function createSchema(options) {
  if (fileExists(options.schemaPath)) {
    const schema = fs.readFileSync(options.schemaPath);

    createMozaikSchema({ schema: schema.toString() }).then(result => {
      // eslint-disable-next-line
      console.log(result.success);
    });
  }
};
