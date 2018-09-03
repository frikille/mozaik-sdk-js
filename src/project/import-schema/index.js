// @flow
const MozaikAPI = require('../../api');

const updateSchemaMutationQuery = `
  mutation importSchema($schema: String!) {
    importSchema(schema: $schema) {
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
        code
        key
        message
      }
    }
  }
`;

type Params = {
  schema: string,
};

function importSchemaMutation({ schema }: Params) {
  return MozaikAPI.call({
    query: updateSchemaMutationQuery,
    variables: {
      schema,
    },
    operationName: 'importSchema',
  });
}

module.exports = importSchemaMutation;
