// @flow
const parseSchema = require('./parse');
const sortContentTypeInputs = require('./sort-content-type-inputs.js');
const createContentTypeInput = require('./create-content-type-input.js');
const apply = require('./apply.js');
const logger = require('../utils/ora-logger.js');

type Options = {
  schema: string,
};

module.exports = function importSchema(options: Options) {
  logger.start('Parsing schema');
  const {
    simpleContentTypes,
    singletonContentTypes,
    embeddableContentTypes,
    hashmapContentTypes,
  } = parseSchema(options.schema);

  const contentTypesToCreate = [
    ...simpleContentTypes.map(c => createContentTypeInput(c)),
    ...singletonContentTypes.map(c => createContentTypeInput(c)),
    ...embeddableContentTypes.map(c => createContentTypeInput(c)),
    ...hashmapContentTypes.map(c => createContentTypeInput(c)),
  ];

  logger.succeed();
  logger.start('Building execution plan');
  const sortedContentTypeInputs = sortContentTypeInputs(contentTypesToCreate);
  logger.succeed();

  return apply(sortedContentTypeInputs).then(() => ({ success: true }));
};
