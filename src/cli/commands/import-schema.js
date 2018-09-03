/* eslint no-console: 0 */
const importSchema = require('../../schema/import-schema.js');
const logger = require('../../utils/ora-logger.js');
const hrtimeToMillis = require('../../utils/hrtime-to-millis.js');

module.exports = function importSchemaCommand(options) {
  logger.start('Importing schema');
  const startTime = process.hrtime();
  importSchema({ filename: options.schemaPath })
    .then(() => {
      const endTime = process.hrtime(startTime);
      const time = hrtimeToMillis(endTime);
      logger.succeed(
        `Schema import finished in ${parseFloat(time / 1000).toFixed(3)}s`
      );
    })
    .catch(err => {
      logger.fail(`Error importing schema: ${err.message}`);
      process.exit(1);
    });
};
