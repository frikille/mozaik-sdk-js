// @flow
const parseSchema = require('./parse');
const sortContentTypeInputs = require('./sort-content-type-inputs.js');
const createContentTypeInput = require('./create-content-type-input.js');
const apply = require('./apply.js');

type Options = {
  schema: string,
};

module.exports = function importSchema(options: Options) {
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

  const sortedContentTypeInputs = sortContentTypeInputs(contentTypesToCreate);
  apply(sortedContentTypeInputs).then(() => ({ success: true }));
};
