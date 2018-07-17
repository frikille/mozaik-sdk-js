// @flow
import type { FieldDefinitionNode } from 'graphql/language/ast';
import type { FieldInput } from '../fields/create/index.js';
const { GraphQLError, GraphQLString } = require('graphql');
const getDirectiveValue = require('./get-directive-value.js');

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

const reservedFieldNames = [
  'id',
  'slug',
  'contentType',
  'displayName',
  'currentVersion',
  'createdAt',
  'updatedAt',
  'project',
  'author',
  'status',
  'content',
  'liveVersionId',
  'latestVersionId',
  'lockId',
  'firstPublishDate',
  'latestPublishDate',
];

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
      throw new GraphQLError('non-null fields are not supported', type);
    default:
      throw new GraphQLError(`unknown field type: ${type.kind}`, type);
  }
}

module.exports = function createFieldInput(
  definition: FieldDefinitionNode
): FieldInput {
  const { type, name, directives = [] } = definition;

  const graphqlType = getFieldType(type);

  let mozaikType = typeMapping[graphqlType.type];
  if (!mozaikType) {
    mozaikType = graphqlType.type
      .replace(/([a-z])([A-Z])/g, g => `${g[0]}_${g[1]}`)
      .toUpperCase();
  }

  const input: FieldInput = {
    label: name.value,
    apiId: name.value,
    type: mozaikType,
    hasMultipleValues: graphqlType.hasMultipleValues,
  };

  if (reservedFieldNames.includes(input.apiId)) {
    throw new GraphQLError(
      `${input.apiId} is a reserved field name`,
      definition
    );
  }

  const groupName = getDirectiveValue(
    directives || [],
    'config',
    'groupName',
    GraphQLString,
    v => {
      if (v === '') {
        throw new GraphQLError('group name can not be empty');
      }
    }
  );

  if (groupName) {
    input.groupName = String(groupName);
  }

  return input;
};
