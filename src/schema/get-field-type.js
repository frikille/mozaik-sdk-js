// @flow
const { GraphQLError } = require('graphql');
import type { TypeNode } from 'graphql/language/ast';

export type FieldOptions = {
  type: string,
  hasMultipleValues: boolean,
  required: boolean,
};

module.exports = function getFieldType(
  type: TypeNode,
  allowList: boolean = true
): FieldOptions {
  let res;
  switch (type.kind) {
    case 'NamedType':
      return {
        type: type.name.value,
        hasMultipleValues: false,
        required: false,
      };
    case 'ListType':
      if (allowList) {
        return {
          type: getFieldType(type.type, false).type,
          hasMultipleValues: true,
          required: false,
        };
      } else {
        throw new GraphQLError('list of lists are not allowed', type);
      }
    case 'NonNullType':
      res = getFieldType(type.type, true);
      return {
        type: res.type,
        hasMultipleValues: res.hasMultipleValues,
        required: true,
      };
    default:
      throw new GraphQLError(`unknown field type: ${type.kind}`, type);
  }
};
