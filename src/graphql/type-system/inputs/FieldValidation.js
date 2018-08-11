// @flow
import type { ValidationEnum } from '../enums/ValidationEnum.js';
import type { FieldValidationConfigInput } from './FieldValidationConfig.js';

const fieldValidationInput = `
input FieldValidationInput {
  type: ValidationEnum!
  config: FieldValidationConfigInput
  errorMessage: String!
}

input FieldValidationUpdateInput {
  id: ID!
  config: FieldValidationConfigInput
  errorMessage: String
}`;

module.exports = fieldValidationInput;

export type FieldValidationInput = {
  type: ValidationEnum,
  config?: FieldValidationConfigInput,
  errorMessage: string,
};

export type FieldValidationUpdateInput = {
  id: number,
  config?: FieldValidationConfigInput,
  errorMessage?: string,
};
