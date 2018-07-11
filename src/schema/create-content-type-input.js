/* eslint no-unused-vars: 0 */
// @flow
const createFieldInput = require('./create-field-input.js');
import type {
  ObjectTypeDefinitionNode,
  EnumTypeDefinitionNode,
} from 'graphql/language/ast';
import type { ContentTypeInput } from '../content-types/create/index.js';

function createContentTypeInputFromObject(
  definition: ObjectTypeDefinitionNode
): ContentTypeInput {
  const { kind, name, interfaces = [], directives, fields } = definition;

  const contentTypeInput: ContentTypeInput = {
    name: name.value,
    apiId: name.value
      .replace(/([a-z])([A-Z])/g, g => `${g[0]}_${g[1]}`)
      .toUpperCase(),
    fields: (fields || []).map(f => createFieldInput(f)),
  };

  switch (interfaces[0].name.value) {
    case 'SingletonContentType':
      contentTypeInput.isLandingPage = true;
      break;
    case 'EmbeddableContentType':
      contentTypeInput.isBlockGroup = true;
      break;
  }

  return contentTypeInput;
}

function createContentTypeInputFromEnum(
  definition: EnumTypeDefinitionNode
): ContentTypeInput {
  const { kind, name, directives, values = [] } = definition;

  return {
    name: name.value,
    apiId: name.value
      .replace(/([a-z])([A-Z])/g, g => `${g[0]}_${g[1]}`)
      .toUpperCase(),
    isEnum: true,
    isHashmap: true,
    enumValues: values.map(v => ({ key: v.name.value, value: v.name.value })),
  };
}

module.exports = function createContentTypeInput(
  definition: ObjectTypeDefinitionNode | EnumTypeDefinitionNode
): ContentTypeInput {
  if (definition.kind === 'ObjectTypeDefinition') {
    return createContentTypeInputFromObject(definition);
  } else {
    return createContentTypeInputFromEnum(definition);
  }
};
