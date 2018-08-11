// @flow

const { GraphQLError } = require('graphql/error');
const { Kind } = require('graphql/language');

const coerceDate = (value: any): string => {
  let dateString;
  if (value instanceof Date) {
    dateString = value.toJSON();
  } else {
    dateString = new Date(value).toJSON();
  }

  if (!dateString) {
    throw new Error('Field error: value is an invalid Date');
  }

  return dateString;
};

const parseDateTime = (ast: Object): Object => {
  if (ast.kind !== Kind.STRING) {
    throw new GraphQLError(
      `Query error: Can only parse strings to dates but got a: ${ast.kind}`,
      [ast]
    );
  }
  const result = new Date(ast.value);
  if (isNaN(result.getTime())) {
    throw new GraphQLError('Query error: Invalid date', [ast]);
  }
  // if (ast.value !== result.toJSON()) {
  //   throw new GraphQLError('Query error: Invalid date format, only accepts: YYYY-MM-DDTHH:MM:SS.SSSZ', [ast]);
  // }
  return result;
};

const dateTimeScalar = `
# The 'DateTime' scalar represents a date and time string in ISO 8601 format: 2016-07-22T11:20:07Z
scalar DateTime
`;

const dateTimeScalarResolver = {
  DateTime: {
    __serialize: coerceDate,
    __parseValue: coerceDate,
    __parseLiteral: parseDateTime,
  },
};

export type DateTime = string;

module.exports = {
  dateTimeScalar,
  dateTimeScalarResolver,
};
