// @flow
const createFieldInput = require('./create-field-input.js');
import type {
  ObjectTypeDefinitionNode,
  EnumTypeDefinitionNode,
  DirectiveNode,
  ArgumentNode,
  ValueNode,
} from 'graphql/language/ast';
const { GraphQLError } = require('graphql');
import type { ContentTypeInput } from '../content-types/create/index.js';

function createContentTypeInputFromObject(
  definition: ObjectTypeDefinitionNode
): ContentTypeInput {
  const { name, interfaces = [], fields = [] } = definition;

  const contentTypeInput: ContentTypeInput = {
    name: name.value,
    apiId: name.value
      .replace(/([a-z])([A-Z])/g, g => `${g[0]}_${g[1]}`)
      .toUpperCase(),
    fields: fields.map(f => createFieldInput(f)),
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
    name: name.value,
    apiId: name.value
      .replace(/([a-z])([A-Z])/g, g => `${g[0]}_${g[1]}`)
      .toUpperCase(),
    isEnum: true,
    isHashmap: true,
    enumValues: values.map(v => {
      try {
        return {
          key: v.name.value,
          value:
            getDirectiveValue(v.directives || [], 'config', 'label') ||
            v.name.value,
        };
      } catch (err) {
        if (err instanceof GraphQLError) {
          throw err;
        }
        throw new GraphQLError(`${err.message}`, v);
      }
    }),
  };
}

function getDirectiveValue(
  directives: $ReadOnlyArray<DirectiveNode>,
  name: string,
  argName: string
): string {
  const validDirectives = directives.filter(d => d.name.value === name) || [];
  if (validDirectives.length === 0) {
    return '';
  }

  try {
    return getArgumentValue(validDirectives[0].arguments || [], argName);
  } catch (err) {
    if (err instanceof GraphQLError) {
      throw err;
    }
    throw new GraphQLError(`${err.message}`, validDirectives[0]);
  }
}

function getArgumentValue(
  args: $ReadOnlyArray<ArgumentNode>,
  name: string
): string {
  const validArgs = args.filter(a => a.name.value === name);
  if (validArgs.length === 0) {
    return '';
  }
  const value = getStringNodeValue(validArgs[0].value);
  if (!value) {
    throw new GraphQLError('label can not be empty', validArgs[0]);
  }
  return value;
}

function getStringNodeValue(node: ValueNode): string {
  if (node.kind !== 'StringValue') {
    throw new GraphQLError('was expecting string value', node);
  }
  return node.value;
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
