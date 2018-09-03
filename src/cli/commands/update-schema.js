// @flow
const getSchemaDiff = require('../../schema/get-schema-diff.js');
const printSchemaDiff = require('../../schema/print-schema-diff.js');
const updateSchema = require('../../schema/update-schema.js');
const logger = require('../../utils/ora-logger.js');
const readline = require('readline');
const hrtimeToMillis = require('../../utils/hrtime-to-millis.js');

function apply(options: Object) {
  logger.start('Applying schema changes');
  const startTime = process.hrtime();

  updateSchema({ filename: options.schemaPath, applyDangerousChanges: true })
    .then(() => {
      const endTime = process.hrtime(startTime);
      const time = hrtimeToMillis(endTime);
      logger.succeed(
        `Schema update finished in ${parseFloat(time / 1000).toFixed(3)}s`
      );
    })
    .catch(err => {
      logger.fail(`Error updating schema: ${err.message}`);
      process.exit(1);
    });
}

module.exports = async function updateSchemaCommand(
  options: Object,
  { force }: Object
) {
  let schemaDiff;
  try {
    schemaDiff = await getSchemaDiff({ filename: options.schemaPath });
    printSchemaDiff(schemaDiff);
  } catch (err) {
    logger.fail(`Error getting schema changes: ${err.message}`);
    process.exit(1);
    return;
  }

  if (schemaDiff.contentTypeChanges.length === 0) {
    return;
  }

  for (let contentTypeChange of schemaDiff.contentTypeChanges) {
    if (contentTypeChange.severity === 'BREAKING') {
      process.exit(1);
      return;
    }
  }

  if (!force) {
    // $FlowFixMe
    var rl = readline.createInterface(process.stdin, process.stdout, null);
    rl.question(
      '\nDo you want to apply these changes (only "yes" is accepted)? ',
      answer => {
        if (answer === 'yes') {
          apply(options);
        }
        rl.close();
        // $FlowFixMe
        process.stdin.destroy();
      }
    );
  } else {
    apply(options);
  }
};
