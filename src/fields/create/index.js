// @flow

import type { FieldValidationInput } from '../validations/create/index.js';

const MozaikAPI = require('../../api');

export type FieldInput = {
  label: string,
  apiId: string,
  type: string,
  contentType?: string,
  hasMultipleValues?: boolean,
  includeInDisplayName?: boolean,
  position?: number,
  groupName?: string,
  description?: string,
  validations?: Array<FieldValidationInput>,
};

const createFieldMutation = `
  mutation createFieldMutation($contentTypeId: ID! $field: FieldInput!) {
    createField(contentTypeId: $contentTypeId field: $field) {
      errors {
        key
        message
      }
      field {
        id
        apiId
        label
      }
    }
  }
`;

type Options = {
  field: FieldInput,
  contentTypeId: string,
};

function createField({ field, contentTypeId }: Options) {
  return MozaikAPI.call({
    query: createFieldMutation,
    variables: {
      field,
      contentTypeId,
    },
    operationName: 'createFieldMutation',
  });
}

module.exports = createField;
