// @flow
/* eslint-disable no-console */
const createContentTypeInput = require('./create-content-type-input.js');
const parseFile = require('./parse-file.js');
const sortContentTypeInputs = require('./sort-content-type-inputs.js');
const { join } = require('path');
const apply = require('./apply.js');

const {
  simpleContentTypes,
  singletonContentTypes,
  embeddableContentTypes,
  hashmapContentTypes,
} = parseFile(join(__dirname, '../../src/schema/fixtures/schema1.graphql'));

const contentTypesToCreate = [
  ...simpleContentTypes.map(c => createContentTypeInput(c)),
  ...singletonContentTypes.map(c => createContentTypeInput(c)),
  ...embeddableContentTypes.map(c => createContentTypeInput(c)),
  ...hashmapContentTypes.map(c => createContentTypeInput(c)),
];

const sortedContentTypeInputs = sortContentTypeInputs(contentTypesToCreate);
apply(sortedContentTypeInputs).then(() => console.log('Finished'));
