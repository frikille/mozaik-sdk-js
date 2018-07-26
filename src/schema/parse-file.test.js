const parseFile = require('./parse-file.js');
const createContentTypeInput = require('./create-content-type-input');
const { join } = require('path');

describe('the parseFile method', () => {
  it('parses an existing file', () => {
    const {
      simpleContentTypes,
      singletonContentTypes,
      embeddableContentTypes,
      hashmapContentTypes,
    } = parseFile(join(__dirname, '../../src/schema/fixtures/schema1.graphql'));

    expect(simpleContentTypes.length).toBeGreaterThan(0);
    simpleContentTypes.forEach(ct => {
      createContentTypeInput(ct);
    });

    expect(singletonContentTypes.length).toBeGreaterThan(0);
    singletonContentTypes.forEach(ct => {
      createContentTypeInput(ct);
    });

    expect(embeddableContentTypes.length).toBeGreaterThan(0);
    embeddableContentTypes.forEach(ct => {
      createContentTypeInput(ct);
    });

    expect(hashmapContentTypes.length).toBeGreaterThan(0);
    hashmapContentTypes.forEach(ct => {
      createContentTypeInput(ct);
    });
  });

  it('throws an error for a non-existing file', () => {
    expect(() => parseFile('file.nonexisting')).toThrowError(
      'failed to read file.nonexisting'
    );
  });
});
