// @flow
const FieldValidationInput = require('../fields/validations/create/index.js');
import type { FieldDefinitionNode, DirectiveNode } from 'graphql/language/ast';
const getArgumentValue = require('./get-argument-value.js');
const { GraphQLInt, GraphQLString } = require('graphql');

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

  if (typeof min !== 'undefined') {
    inputs.push({
      type: 'MIN_LENGTH',
      config: { lengthMin: parseInt(min) },
      errorMessage: errorMessage,
    });
  }

  if (typeof max !== 'undefined') {
    inputs.push({
      type: 'MAX_LENGTH',
      config: { lengthMax: parseInt(max) },
      errorMessage: errorMessage,
    });
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
    inputs.push(...createLengthValidation(field, directive));
  }

  return inputs;
};
