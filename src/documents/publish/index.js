const MozaikAPI = require('../../api');

const publishDocumentMutation = `
  mutation publishDocumentMutation($documentId: ID!) {
    publishDocument(documentId: $documentId) {
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

function publishDocument(documentId) {
  return MozaikAPI.call({
    query: publishDocumentMutation,
    variables: {
      documentId,
    },
  });
}

module.exports = publishDocument;
