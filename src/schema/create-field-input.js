// @flow
import type { FieldDefinitionNode } from 'graphql/language/ast';
import type { FieldInput } from '../fields/create/index.js';
const { GraphQLError, GraphQLString, GraphQLBoolean } = require('graphql');
const getDirectiveValue = require('./get-directive-value.js');
const generateLabel = require('./generate-label.js');
const getFieldType = require('./get-field-type.js');
const createFieldValidationInputs = require('./create-field-validation-inputs.js');

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
  let label = getDirectiveValue(
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
    label = String(label);
  } else {
    label = generateLabel(name.value);
  }

  return label.charAt(0).toUpperCase() + label.slice(1);
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
    mozaikType = graphqlType.type;
  }

  if (reservedFieldNames.includes(name.value)) {
    throw new GraphQLError(
      `${name.value} is a reserved field name`,
      definition
    );
  }

  const input: FieldInput = {
    label: getLabel(definition),
    apiId: name.value,
    description: definition.description
      ? definition.description.value.trim()
      : '',
    type: mozaikType,
    hasMultipleValues: graphqlType.hasMultipleValues,
    validations: createFieldValidationInputs(definition),
  };

  setGroupName(definition, input);
  setIncludeInDisplayName(definition, input);

  return input;
};
