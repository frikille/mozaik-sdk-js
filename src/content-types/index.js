// @flow
const createContentType = require('./create/index.js');
import type { ContentTypeInput } from './create/index.js';

export type ContentType = { id: string } & ContentTypeInput;

const contentType = {
  create: createContentType,
};

module.exports = contentType;
