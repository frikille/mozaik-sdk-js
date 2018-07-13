// @flow
const createField = require('./create/index.js');
import type { FieldInput } from './create/index.js';

export type Field = { id: string } & FieldInput;

const field = {
  create: createField,
};

module.exports = field;
