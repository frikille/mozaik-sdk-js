// @flow
import type { FieldDefinitionNode } from 'graphql/language/ast';
import type { FieldInput } from '../fields/create/index.js';
const { GraphQLError, GraphQLString, GraphQLBoolean } = require('graphql');
const getDirectiveValue = require('./get-directive-value.js');

const typeMapping = new Map([
  ['String', 'TEXT_SINGLELINE'],
  ['Int', 'INTEGER'],
  ['Float', 'FLOAT'],
  ['Boolean', 'BOOLEAN'],
  ['ID', 'TEXT_SINGLELINE'],
  ['SinglelineText', 'TEXT_SINGLELINE'],
  ['MultilineText', 'TEXT_MULTILINE'],
  ['RichText', 'RICH_TEXT'],
  ['Date', 'DATE'],
  ['DateTime', 'DATE_TIME'],
  ['Audio', 'AUDIO'],
  ['File', 'FILE'],
  ['Image', 'IMAGE'],
  ['Video', 'VIDEO'],
]);

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

function setGroupName(definition: FieldDefinitionNode, input: FieldInput) {
  const { directives = [] } = definition;
  const groupName = getDirectiveValue(
    directives,
    'config',
    'groupName',
    GraphQLString,
    v => {
      if (v === '') {
        throw new Error('group name can not be empty');
      }
    }
  );

  if (groupName) {
    input.groupName = String(groupName);
  }
}

function getLabel(definition: FieldDefinitionNode): string {
  const { name, directives = [] } = definition;
  const label = getDirectiveValue(
    directives,
    'config',
    'label',
    GraphQLString,
    v => {
      if (v === '') {
        throw new Error('label can not be empty');
      }
    }
  );

  if (label) {
    return String(label);
  } else {
    // we'll convert camel case to a lowercase label where words are separate by space
    // if there is an uppercase abbreviation we'll leave it untouched
    // underscore chars will be replaced with spaces
    // if the field name contains a number than we'll add a space before the number
    // e.g. "myField" => "my field", "myCMSId" => "my CMS id"
    //      "my_field" => "my field", "myField1" => "my field 1"
    let label = name.value
      .replace('_', ' ')
      .replace(
        /([a-zA-Z])([A-Z])([a-z])/g,
        g => `${g[0]} ${g[1].toLowerCase()}${g[2]}`
      )
      .replace(/([a-z])([A-Z])/g, g => `${g[0]} ${g[1]}`)
      .replace(/([a-zA-Z])([0-9])/g, g => `${g[0]} ${g[1]}`);

    return label.charAt(0).toUpperCase() + label.slice(1);
  }
}

function setIncludeInDisplayName(
  definition: FieldDefinitionNode,
  input: FieldInput
) {
  const { type, directives = [] } = definition;
  const isTitle = getDirectiveValue(
    directives,
    'config',
    'isTitle',
    GraphQLBoolean,
    () => {}
  );

  if (isTitle) {
    if (input.type !== 'TEXT_SINGLELINE') {
      const singleLineTypes = [];
      for (const [graphqlType, mozaikType] of typeMapping) {
        if (mozaikType === 'TEXT_SINGLELINE') {
          singleLineTypes.push(graphqlType);
        }
      }
      throw new GraphQLError(
        `isTitle flag is only valid on ${singleLineTypes.join(', ')} fields`,
        type
      );
    }
    input.includeInDisplayName = true;
  }
}

module.exports = function createFieldInput(
  definition: FieldDefinitionNode
): FieldInput {
  const { type, name } = definition;

  const graphqlType = getFieldType(type);

  let mozaikType = typeMapping.get(graphqlType.type);
  if (!mozaikType) {
    mozaikType = graphqlType.type
      .replace(/([a-z])([A-Z])/g, g => `${g[0]}_${g[1]}`)
      .toUpperCase();
  }

  const input: FieldInput = {
    label: getLabel(definition),
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

  setGroupName(definition, input);
  setIncludeInDisplayName(definition, input);

  return input;
};
