/* eslint no-console: 0 */
const fs = require('fs');
const fileExists = require('../../utils/file-exists');
const createMozaikSchema = require('../../schema/create-schema.js');
const hrtimeToMillis = require('../../utils/hrtime-to-millis.js');
const chalk = require('chalk');

module.exports = function createSchema(options) {
  if (fileExists(options.schemaPath)) {
    const startTime = process.hrtime();
    const schema = fs.readFileSync(options.schemaPath);

    createMozaikSchema({ schema: schema.toString() })
      .then(() => {
        const endTime = process.hrtime(startTime);
        const time = hrtimeToMillis(endTime);
        console.log(
          chalk.green(
            `Schema import finished in ${parseFloat(time / 1000).toFixed(3)}s`
          )
        );
      })
      .catch(error => {
        console.error(chalk.red(error.message));
      });
  }
};
