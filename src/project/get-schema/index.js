// @flow

const MozaikAPI = require('../../api');

const getSchemaQuery = `
  {
    project {
      schema
    }
  }
`;

function getProjectSchema() {
  return MozaikAPI.call({
    query: getSchemaQuery,
  });
}

module.exports = getProjectSchema;
