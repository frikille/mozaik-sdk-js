// @flow
import type { FieldDefinitionNode } from 'graphql/language/ast';
import type { FieldInput } from '../fields/create/index.js';
const { GraphQLString, GraphQLBoolean } = require('graphql');
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
  const { directives = [] } = definition;
  const isTitle = getDirectiveValue(
    directives,
    'config',
    'isTitle',
    GraphQLBoolean,
    () => {}
  );

  if (isTitle) {
    input.includeInDisplayName = true;
  }
}

function setIsDeprecated(definition: FieldDefinitionNode, input: FieldInput) {
  const { directives = [] } = definition;
  if (directives.filter(d => d.name.value === 'deprecated').length > 0) {
    input.isDeprecated = true;
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
  setIsDeprecated(definition, input);

  return input;
};
