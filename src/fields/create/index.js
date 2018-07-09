const MozaikAPI = require('../../api');

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

function createField({ field, contentTypeId }) {
  return MozaikAPI.call({
    query: createFieldMutation,
    variables: {
      field,
      contentTypeId
    }
  });
}

module.exports = createField;
