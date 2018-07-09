const MozaikAPI = require('../../api');

const createDocumentMutation = `
  mutation createDocumentMutation($document: DocumentInput!) {
    createDocument(document: $document) {
      document {
        id
      }
      errors {
        key
        message
      }
    }
  }
`;

function createDocument(document) {
  return MozaikAPI.call({
    apiEndpoint,
    accessToken,
    query: createDocumentMutation,
    variables: {
      document
    }
  });
}

module.exports = createDocument;
