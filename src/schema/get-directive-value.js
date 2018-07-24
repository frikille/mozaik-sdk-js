// @flow
import type { DirectiveNode } from 'graphql/language/ast';
import type { GraphQLInputType } from 'graphql';
const getArgumentValue = require('./get-argument-value.js');

module.exports = function getDirectiveValue(
  directives: $ReadOnlyArray<DirectiveNode>,
  name: string,
  argName: string,
  type: GraphQLInputType,
  validator: (value: mixed) => void
) {
  const validDirectives = directives.filter(d => d.name.value === name) || [];
  if (validDirectives.length === 0) {
    return undefined;
  }

  return getArgumentValue(
    validDirectives[0].arguments || [],
    argName,
    type,
    validator
  );
};
