// @flow
const createFieldInput = require('./create-field-input.js');
import type {
  ObjectTypeDefinitionNode,
  EnumTypeDefinitionNode,
} from 'graphql/language/ast';
const { GraphQLString } = require('graphql');
import type { ContentTypeInput } from '../content-types/create/index.js';
const getDirectiveValue = require('./get-directive-value.js');
const generateLabel = require('./generate-label.js');

function createContentTypeInputFromObject(
  definition: ObjectTypeDefinitionNode
): ContentTypeInput {
  const { name, interfaces = [], fields = [] } = definition;

  let position = 1;
  const contentTypeInput: ContentTypeInput = {
    name: generateLabel(name.value),
    apiId: name.value
      .replace(/([a-z])([A-Z])/g, g => `${g[0]}_${g[1]}`)
      .toUpperCase(),
    fields: fields.map(f => {
      const field = createFieldInput(f);
      field.position = position++;
      return field;
    }),
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
  const { name, values = [] } = definition;

  return {
    name: generateLabel(name.value),
    apiId: name.value
      .replace(/([a-z])([A-Z])/g, g => `${g[0]}_${g[1]}`)
      .toUpperCase(),
    isEnum: true,
    isHashmap: true,
    enumValues: values.map(v => {
      const value =
        getDirectiveValue(
          v.directives || [],
          'config',
          'label',
          GraphQLString,
          v => {
            if (v === '') {
              throw new Error('label can not be empty');
            }
          }
        ) || v.name.value;
      return {
        key: v.name.value,
        value: String(value),
      };
    }),
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
