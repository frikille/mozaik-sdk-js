// @flow
import type { FieldDefinitionNode } from 'graphql/language/ast';
import type { FieldInput } from '../fields/create/index.js';

const typeMapping = {
  String: 'TEXT_SINGLELINE',
  Int: 'INTEGER',
  Float: 'FLOAT',
  Boolean: 'BOOLEAN',
  ID: 'TEXT_SINGLELINE',
  SinglelineText: 'TEXT_SINGLELINE',
  MultilineText: 'TEXT_MULTILINE',
  RichText: 'RICH_TEXT',
  Date: 'DATE',
  DateTime: 'DATE_TIME',
  Audio: 'AUDIO',
  File: 'FILE',
  Image: 'IMAGE',
  Video: 'VIDEO',
};

type FieldOptions = {
  type: string,
  hasMultipleValues: boolean,
};

function getFieldType(type): FieldOptions {
  switch (type.kind) {
    case 'NamedType':
      return {
        type: type.name.value,
        hasMultipleValues: false,
      };
    case 'ListType':
      return {
        type: getFieldType(type.type).type,
        hasMultipleValues: true,
      };
    case 'NonNullType':
      throw new Error('non-null type fields are not supported');
    default:
      throw new Error(`unknown field type: ${type.kind}`);
  }
}

module.exports = function createFieldInput(
  definition: FieldDefinitionNode
): FieldInput {
  const { type, name } = definition;

  const graphqlType = getFieldType(type);

  const mozaikType = typeMapping[graphqlType.type];
  if (!mozaikType) {
    throw new Error(`missing GraphQL type mapping for ${graphqlType.type}`);
  }

  return {
    label: name.value,
    apiId: name.value,
    type: mozaikType,
    hasMultipleValues: graphqlType.hasMultipleValues,
    //position?: number,
    //groupName?: string,
  };
};
