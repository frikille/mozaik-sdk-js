// @flow
import type { FieldDefinitionNode } from 'graphql/language/ast';
import type { FieldInput } from '../fields/create/index.js';

module.exports = function createFieldInput(
  fieldDefinition: FieldDefinitionNode
): FieldInput {
  return {};
};
