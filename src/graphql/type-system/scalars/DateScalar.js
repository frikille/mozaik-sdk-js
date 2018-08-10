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

  return dateString.substring(0, dateString.indexOf('T'));
};

const parseDate = (ast: Object): Object => {
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

  const dateString = result.toJSON();
  if (ast.value !== dateString.substring(0, dateString.indexOf('T'))) {
    throw new GraphQLError(
      'Query error: Invalid date format, only accepts: YYYY-MM-DD',
      [ast]
    );
  }
  return result;
};

const dateScalar = `
# The 'Date' scalar represents a date string in ISO 8601 format: 2016-07-22
scalar Date
`;

const dateScalarResolver = {
  Date: {
    __serialize: coerceDate,
    __parseValue: coerceDate,
    __parseLiteral: parseDate,
  },
};

module.exports = {
  dateScalar,
  dateScalarResolver,
};

export type DateType = string;
