// @flow
const getSchemaDiff = require('../../schema/get-schema-diff.js');
const printSchemaDiff = require('../../schema/print-schema-diff.js');
const updateSchema = require('../../schema/update-schema.js');
const logger = require('../../utils/ora-logger.js');
const readline = require('readline');

function apply(options: Object) {
  logger.start('Applying schema changes');

  updateSchema({ filename: options.schemaPath, applyDangerousChanges: true })
    .then(() => {
      logger.succeed();
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
  const schemaDiff = await getSchemaDiff({ filename: options.schemaPath });
  printSchemaDiff(schemaDiff);

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
