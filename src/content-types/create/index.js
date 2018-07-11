// @flow
const MozaikAPI = require('../../api');
import type { FieldInput } from '../../fields/create/index.js';

export type ContentTypeInput = {
  name: string,
  apiId: string,
  description?: string,
  fields?: Array<FieldInput>,
  isLandingPage?: boolean,
  isBlockGroup?: boolean,
  isEnum?: boolean,
  isHashmap?: boolean,
  enumValues?: Array<{ key: string, value: string }>,
};

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

type Options = {
  contentType: ContentTypeInput,
};

async function createContentType({ contentType }: Options) {
  return MozaikAPI.call({
    query: createContentTypeMutation,
    variables: {
      contentType,
    },
  });
}

module.exports = createContentType;
