// @flow
import type { DirectiveNode, ArgumentNode } from 'graphql/language/ast';
import type { GraphQLInputType } from 'graphql';
const { GraphQLError, valueFromAST } = require('graphql');

function getArgumentValue(
  args: $ReadOnlyArray<ArgumentNode>,
  name: string,
  type: GraphQLInputType,
  validator: (value: mixed) => void
) {
  const validArgs = args.filter(a => a.name.value === name);
  if (validArgs.length === 0) {
    return '';
  }
  const value = valueFromAST(validArgs[0].value, type);
  if (typeof value === 'undefined') {
    throw new GraphQLError(
      `was expecting ${type.toString()}`,
      validArgs[0].value
    );
  }
  try {
    validator(value);
  } catch (err) {
    throw new GraphQLError(`${err.message}`, validArgs[0].value);
  }
  return value;
}

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
