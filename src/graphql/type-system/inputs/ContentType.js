// @flow
import type { FieldInput } from './Field';

const contentTypeInput = `
input HashmapItemInput {
  key: String!
  value: String
}

input ContentTypeInput {
  name: String!
  apiId: String!
  description: String
  isLandingPage: Boolean
  isBlockGroup: Boolean
  isEnum: Boolean
  isHashmap: Boolean
  fields: [FieldInput]
  enumValues: [HashmapItemInput]
}

input ContentTypeUpdateInput {
  id: ID!
  name: String
  apiId: String
  description: String
  isLandingPage: Boolean
  isBlockGroup: Boolean
  isEnum: Boolean
  isHashmap: Boolean
  enumValues: [HashmapItemInput]
}
`;

module.exports = contentTypeInput;

export type ContentTypeInput = {
  name: string,
  apiId: string,
  description?: string,
  fields?: Array<FieldInput>,
  isLandingPage?: boolean,
  isBlockGroup?: boolean,
  isEnum?: boolean,
  isHashmap?: boolean,
  enumValues?: Array<{ key: string, value: string }>,
};

export type ContentTypeUpdateInput = {
  id: string,
  name?: string,
  apiId?: string,
  description?: string,
  isLandingPage?: boolean,
  isBlockGroup?: boolean,
  isEnum?: boolean,
  isHashmap?: boolean,
  enumValues?: Array<{ key: string, value: string }>,
};
