// @flow
import type { ArgumentNode } from 'graphql/language/ast';
import type { GraphQLInputType } from 'graphql';
const { GraphQLError, valueFromAST } = require('graphql');

module.exports = function getArgumentValue(
  args: $ReadOnlyArray<ArgumentNode>,
  name: string,
  type: GraphQLInputType,
  validator: (value: mixed) => void
) {
  const validArgs = args.filter(a => a.name.value === name);
  if (validArgs.length === 0) {
    return undefined;
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
};
