// @flow
const FieldValidationInput = require('../fields/validations/create/index.js');
import type { GraphQLInputType } from 'graphql';
import type { FieldDefinitionNode, DirectiveNode } from 'graphql/language/ast';
const getArgumentValue = require('./get-argument-value.js');
const getFieldType = require('./get-field-type.js');
const { GraphQLInt, GraphQLFloat, GraphQLString } = require('graphql');

function createLengthValidation(
  field: FieldDefinitionNode,
  directive: DirectiveNode
): Array<FieldValidationInput> {
  const inputs: Array<FieldValidationInput> = [];

  const { arguments: args = [] } = directive;
  const min = getArgumentValue(args, 'minLength', GraphQLInt, () => {});
  const max = getArgumentValue(args, 'maxLength', GraphQLInt, v => {
    if (typeof min !== 'undefined' && parseInt(v) < parseInt(min)) {
      throw new Error('maxLength should be equal or greater than minLength');
    }
  });
  const errorMessage = getArgumentValue(
    args,
    'errorMessage',
    GraphQLString,
    () => {}
  );

  if (typeof min === 'undefined' && typeof max === 'undefined') {
    return [];
  }

  if (typeof min !== 'undefined' && typeof max !== 'undefined') {
    inputs.push({
      type: 'LENGTH_RANGE',
      config: { lengthMin: parseInt(min), lengthMax: parseInt(max) },
      errorMessage: errorMessage,
    });
  } else if (typeof min !== 'undefined') {
    inputs.push({
      type: 'MIN_LENGTH',
      config: { lengthMin: parseInt(min) },
      errorMessage: errorMessage,
    });
  } else {
    inputs.push({
      type: 'MAX_LENGTH',
      config: { lengthMax: parseInt(max) },
      errorMessage: errorMessage,
    });
  }

  return inputs;
}

function createMinMaxValidation(
  field: FieldDefinitionNode,
  directive: DirectiveNode,
  type: GraphQLInputType
): Array<FieldValidationInput> {
  const inputs: Array<FieldValidationInput> = [];

  const { arguments: args = [] } = directive;
  const min = getArgumentValue(args, 'min', type, () => {});
  const max = getArgumentValue(args, 'max', type, v => {
    if (typeof min !== 'undefined' && Number(v) < Number(min)) {
      throw new Error('max should be equal or greater than min');
    }
  });
  const errorMessage = getArgumentValue(
    args,
    'errorMessage',
    GraphQLString,
    () => {}
  );

  if (typeof min === 'undefined' && typeof max === 'undefined') {
    return [];
  }

  const config = {};
  if (typeof min !== 'undefined' && typeof max !== 'undefined') {
    config[`valueMin${type.toString()}`] = Number(min);
    config[`valueMax${type.toString()}`] = Number(max);
    inputs.push({ type: 'RANGE', config, errorMessage });
  } else if (typeof min !== 'undefined') {
    config[`valueMin${type.toString()}`] = Number(min);
    inputs.push({ type: 'MIN_VALUE', config, errorMessage });
  } else {
    config[`valueMax${type.toString()}`] = Number(max);
    inputs.push({ type: 'MAX_VALUE', config, errorMessage });
  }

  return inputs;
}

module.exports = function createFieldValidationInputs(
  field: FieldDefinitionNode
): Array<FieldValidationInput> {
  const inputs: Array<FieldValidationInput> = [];

  const { directives = [] } = field;
  const validationDirectives =
    directives.filter(d => d.name.value === 'validation') || [];

  for (let directive of validationDirectives) {
    const { type, hasMultipleValues } = getFieldType(field.type);
    if (!hasMultipleValues) {
      switch (type) {
        case 'String':
        case 'ID':
        case 'SinglelineText':
        case 'MultilineText':
        case 'RichText':
          inputs.push(...createLengthValidation(field, directive));
          break;
        case 'Int':
          inputs.push(...createMinMaxValidation(field, directive, GraphQLInt));
          break;
        case 'Float':
          inputs.push(
            ...createMinMaxValidation(field, directive, GraphQLFloat)
          );
          break;
        case 'Date':
        case 'DateTime':
        case 'File':
        case 'Audio':
        case 'Image':
        case 'Video':
          break;
      }
    }
  }

  return inputs;
};
