// @flow
const createField = require('./create/index.js');
const createFieldValidation = require('./validations/create/index.js');
import type { FieldInput } from './create/index.js';

export type DateType = string;
export type DateTime = string;

export type Field = { id: string } & FieldInput;

const field = {
  create: createField,
  createValidation: createFieldValidation,
};

module.exports = field;
