const MozaikAPI = require('../../api');

const createContentTypeMutation = `
  mutation createContentType($contentType: ContentTypeInput!) {
    createContentType(contentType: $contentType) {
      errors {
        key
        message
      }
      contentType {
        id
        apiId
      }
    }
  }
`;

async function createContentType({ contentType }) {
  return MozaikAPI.call({
    query: createContentTypeMutation,
    variables: {
      contentType,
    },
  });
}

module.exports = createContentType;
