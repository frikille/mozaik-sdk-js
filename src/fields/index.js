// @flow
const createField = require('./create/index.js');
const createFieldValidation = require('./validations/create/index.js');
import type { FieldInput } from './create/index.js';

export type Field = { id: string } & FieldInput;

const field = {
  create: createField,
  createValidation: createFieldValidation,
};

module.exports = field;
