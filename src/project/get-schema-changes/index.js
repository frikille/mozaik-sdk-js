// @flow
const MozaikAPI = require('../../api');

const getSchemaChangesQuery = `
  query schemaChanges($newSchema: String!) {
    project {
      schemaChanges(newSchema: $newSchema) {
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
      }
    }
  }
`;

type Params = {
  schema: string,
};

function getProjectSchemaChanges({ schema }: Params) {
  return MozaikAPI.call({
    query: getSchemaChangesQuery,
    variables: {
      newSchema: schema,
    },
    operationName: 'schemaChanges',
  });
}

module.exports = getProjectSchemaChanges;
