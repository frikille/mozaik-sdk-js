// @flow
const MozaikAPI = require('../../../api');
import type { ValidationEnum, FieldValidationConfigInput } from './../index.js';

export type FieldValidationInput = {
  type: ValidationEnum,
  config: FieldValidationConfigInput,
  errorMessage: string,
};

const createFieldValidationMutation = `
  mutation createFieldValidationMutation($fieldId: ID! $fieldValidation: FieldValidationInput!) {
    createFieldValidation(fieldId: $fieldId fieldValidation: $fieldValidation) {
      errors {
        key
        message
      }
      fieldValidation {
        id
      }
    }
  }
`;

type Options = {
  fieldId: string,
  fieldValidation: FieldValidationInput,
};

function createFieldValidation({ fieldId, fieldValidation }: Options) {
  return MozaikAPI.call({
    query: createFieldValidationMutation,
    variables: {
      fieldId,
      fieldValidation,
    },
    operationName: 'createFieldValidationMutation',
  });
}

module.exports = createFieldValidation;
