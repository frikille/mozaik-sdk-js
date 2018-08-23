// @flow
const MozaikAPI = require('../../api');

const updateSchemaMutationQuery = `
  mutation updateSchema($newSchema: String!, $applyDangerousChanges: Boolean) {
    updateSchema(newSchema: $newSchema, applyDangerousChanges: $applyDangerousChanges) {
      contentTypeChanges {
        type
        severity
        name
        description
        attributeChanges {
          type
          severity
          name
          from
          to
          description
        }
        fieldChanges {
          type
          severity
          name
          description
          validationChanges {
            type
            severity
            name
            description
            attributeChanges {
              type
              severity
              name
              from
              to
              description
            }
          }
          attributeChanges {
            type
            severity
            name
            from
            to
            description
          }
        }
        enumValueChanges {
          type
          severity
          name
          description
          attributeChanges {
            type
            severity
            name
            from
            to
            description
          }
        }
      }
      errors {
        key
        message
      }
    }
  }
`;

type Params = {
  schema: string,
  applyDangerousChanges: boolean,
};

function updateSchemaMutation({ schema, applyDangerousChanges }: Params) {
  return MozaikAPI.call({
    query: updateSchemaMutationQuery,
    variables: {
      newSchema: schema,
      applyDangerousChanges,
    },
    operationName: 'updateSchema',
  });
}

module.exports = updateSchemaMutation;
