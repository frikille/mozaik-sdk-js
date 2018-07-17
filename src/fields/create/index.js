// @flow
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
