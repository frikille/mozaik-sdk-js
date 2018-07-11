const graphql = require('graphql');
const { parse, buildASTSchema } = graphql;
const baseSchema = require('./base-schema.js');

module.exports = function extractContentTypes(schema) {
  const fullSchema = `${baseSchema}\n${schema}`;

  const parsedSchema = parse(fullSchema);

  const ast = buildASTSchema(parsedSchema);

  const { _implementations } = ast;

  const typesByName = {};
  const hashmapContentTypes = [];

  parsedSchema.definitions.forEach(definition => {
    typesByName[definition.name.value] = definition;
    if (definition.kind === 'EnumTypeDefinition') {
      hashmapContentTypes.push(definition);
    }
  });

  const simpleContentTypes = (_implementations.SimpleContentType || []).map(
    name => typesByName[name]
  );
  const singletonContentTypes = (
    _implementations.SingletonContentType || []
  ).map(name => typesByName[name]);
  const embeddableContentTypes = (
    _implementations.EmbeddableContentType || []
  ).map(name => typesByName[name]);

  return {
    simpleContentTypes,
    singletonContentTypes,
    embeddableContentTypes,
    hashmapContentTypes,
  };
};
