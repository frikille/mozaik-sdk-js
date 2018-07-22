// @flow
const { GraphQLError } = require('graphql');
import type { TypeNode } from 'graphql/language/ast';

export type FieldOptions = {
  type: string,
  hasMultipleValues: boolean,
};

module.exports = function getFieldType(
  type: TypeNode,
  allowList: boolean = true
): FieldOptions {
  switch (type.kind) {
    case 'NamedType':
      return {
        type: type.name.value,
        hasMultipleValues: false,
      };
    case 'ListType':
      if (allowList) {
        return {
          type: getFieldType(type.type).type,
          hasMultipleValues: true,
        };
      } else {
        throw new GraphQLError('list of lists are not allowed', type);
      }
    case 'NonNullType':
      throw new GraphQLError('non-null fields are not supported', type);
    default:
      throw new GraphQLError(`unknown field type: ${type.kind}`, type);
  }
};
