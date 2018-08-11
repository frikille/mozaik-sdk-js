// @flow
import type { FieldValidationInput } from './FieldValidation.js';

const fieldInput = `
input FieldInput {
  label: String!
  apiId: String!
  type: AllContentTypeEnum!
  contentType: ProjectContentTypeEnum
  hasMultipleValues: Boolean
  position: Int
  groupName: String,
  includeInDisplayName: Boolean,
  description: String
  validations: [FieldValidationInput]
}

input FieldUpdateInput {
  id: ID!
  label: String
  position: Int
  groupName: String,
  description: String,
  includeInDisplayName: Boolean
}
`;

module.exports = fieldInput;

export type FieldInput = {|
  label: string,
  apiId: string,
  type: string,
  contentType?: string,
  hasMultipleValues?: boolean,
  position?: number,
  groupName?: string,
  description?: string,
  includeInDisplayName?: boolean,
  validations?: Array<FieldValidationInput>,
|};

export type FieldUpdateInput = {|
  id: string,
  label: string,
  position?: number,
  groupName?: string,
  description?: string,
  includeInDisplayName?: boolean,
|};
