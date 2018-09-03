// @flow
const exportMozaikSchema = require('../../schema/export-schema.js');
const logger = require('../../utils/ora-logger.js');
const hrtimeToMillis = require('../../utils/hrtime-to-millis.js');

type CmdOptions = {
  force: boolean,
  print: boolean,
};

module.exports = function exportSchema(
  options: Object,
  { force, print }: CmdOptions
) {
  if (!print) {
    logger.start('Exporting schema');
  }

  const startTime = process.hrtime();

  exportMozaikSchema({ filename: options.schemaPath, force, print })
    .then(() => {
      if (!print) {
        const endTime = process.hrtime(startTime);
        const time = hrtimeToMillis(endTime);
        logger.succeed(
          `Schema export finished in ${parseFloat(time / 1000).toFixed(3)}s`
        );
        logger.info(`Schema was written to ${options.schemaPath}`);
      }
    })
    .catch(err => {
      logger.fail(`Error exporting schema: ${err.message}`);
      process.exit(1);
    });
};
