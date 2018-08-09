// @flow
import type { ContentType } from '../content-types/index.js';
import type { ContentTypeInput } from '../content-types/create/index.js';
import type { Field } from '../fields/index.js';
import type { FieldInput } from '../fields/create/index.js';
import type { FieldValidation } from '../fields/validations/index.js';
import type { FieldValidationInput } from '../fields/validations/create/index.js';

const callCreateContentType = require('./../content-types/create/index.js');
const callCreateField = require('./../fields/create/index.js');
const callCreateFieldValidation = require('./../fields/validations/create/index.js');
const oraLogger = require('../utils/ora-logger.js');

async function createContentType(
  contentTypeInput: ContentTypeInput
): Promise<ContentType> {
  const { apiId } = contentTypeInput;

  oraLogger.start(`Creating ${apiId} content type`);

  const contentTypeWithoutFields = { ...contentTypeInput };
  contentTypeWithoutFields.fields = [];

  const apiResult = await callCreateContentType({
    contentType: contentTypeWithoutFields,
  });

  // checking GraphQL errors
  let errors = apiResult.errors;
  if (errors && errors.length > 0) {
    oraLogger.fail();
    throw new Error(
      `Error in creating ${apiId} content type: ${errors[0].message}`
    );
  }

  // checking validation errors
  errors = apiResult.data.createContentType.errors;
  if (errors && errors.length > 0) {
    oraLogger.fail();
    throw new Error(
      `Error in creating ${apiId} content type: ${errors[0].message}`
    );
  }

  oraLogger.succeed(`${apiId} content type added`);

  return {
    id: apiResult.data.createContentType.contentType.id,
    ...contentTypeInput,
  };
}

async function createField(
  contentType: ContentType,
  fieldInput: FieldInput
): Promise<Field> {
  const { id: contentTypeId, apiId: contentTypeApiId } = contentType;
  const { apiId, validations = [] } = fieldInput;

  oraLogger.start(`Creating ${contentTypeApiId}.${apiId} field`);

  const fieldInputWithoutValidations = { ...fieldInput };
  delete fieldInputWithoutValidations.validations;

  const apiResult = await callCreateField({
    field: fieldInputWithoutValidations,
    contentTypeId,
  });

  // checking standard GraphQL errors
  let errors = apiResult.errors;
  if (errors && errors.length > 0) {
    oraLogger.fail();
    throw new Error(
      `Error in creating ${contentTypeApiId}.${apiId} field: ${
        errors[0].message
      }`
    );
  }

  // checking validations errors
  errors = apiResult.data.errors;
  if (errors && errors.length > 0) {
    oraLogger.fail();
    throw new Error(
      `Error in creating ${contentTypeApiId}.${apiId} field: ${
        errors[0].message
      }`
    );
  }

  const field: Field = {
    id: apiResult.data.createField.field.id,
    ...fieldInput,
  };

  oraLogger.succeed(`${contentTypeApiId}.${apiId} field added`);

  for (let fieldValidationInput of validations) {
    try {
      await createFieldValidation(contentType, field, fieldValidationInput);
    } catch (error) {
      throw error;
    }
  }

  return field;
}

async function createFieldValidation(
  contentType: ContentType,
  field: Field,
  fieldValidationInput: FieldValidationInput
): Promise<FieldValidation> {
  const { apiId: contentTypeApiId } = contentType;
  const { id: fieldId, apiId: fieldApiId } = field;
  const { type } = fieldValidationInput;

  oraLogger.start(
    `Creating ${contentTypeApiId}.${fieldApiId}.${type} validation`
  );

  const apiResult = await callCreateFieldValidation({
    fieldId,
    fieldValidation: fieldValidationInput,
  });

  // checking standard GraphQL errors
  let errors = apiResult.errors;
  if (errors && errors.length > 0) {
    oraLogger.fail();
    throw new Error(
      `Error in creating ${contentTypeApiId}.${fieldApiId}.${type} validation: ${
        errors[0].message
      }`
    );
  }

  // checking validations errors
  errors = apiResult.data.errors;
  if (errors && errors.length > 0) {
    oraLogger.fail();
    throw new Error(
      `Error in creating ${contentTypeApiId}.${fieldApiId}.${type} validation: ${
        errors[0].message
      }`
    );
  }

  oraLogger.succeed(
    `${contentTypeApiId}.${fieldApiId}.${type} validation added`
  );

  return {
    id: apiResult.data.createFieldValidation.fieldValidation.id,
    ...fieldValidationInput,
  };
}

module.exports = async function apply(
  contentTypeInputs: Array<ContentTypeInput>
) {
  try {
    for (let contentTypeInput of contentTypeInputs) {
      try {
        const contentType = await createContentType(contentTypeInput);
        const { fields = [] } = contentTypeInput;
        for (let fieldInput of fields) {
          try {
            await createField(contentType, fieldInput);
          } catch (error) {
            throw error;
          }
        }
      } catch (error) {
        throw error;
      }
    }
  } catch (e) {
    throw e;
  }
};
