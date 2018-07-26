// @flow
/* eslint-disable no-console */
import type { ContentType } from '../content-types/index.js';
import type { ContentTypeInput } from '../content-types/create/index.js';
import type { Field } from '../fields/index.js';
import type { FieldInput } from '../fields/create/index.js';
import type { FieldValidation } from '../fields/validations/index.js';
import type { FieldValidationInput } from '../fields/validations/create/index.js';

const callCreateContentType = require('./../content-types/create/index.js');
const callCreateField = require('./../fields/create/index.js');
const callCreateFieldValidation = require('./../fields/validations/create/index.js');

async function createContentType(
  contentTypeInput: ContentTypeInput
): Promise<ContentType> {
  const { apiId } = contentTypeInput;

  console.log(`Creating ${apiId} content type...`);

  const contentTypeWithoutFields = { ...contentTypeInput };
  contentTypeWithoutFields.fields = [];

  const apiResult = await callCreateContentType({
    contentType: contentTypeWithoutFields,
  });

  // checking GraphQL errors
  let errors = apiResult.errors;
  if (errors && errors.length > 0) {
    throw new Error(
      `Error in creating ${apiId} content type: ${apiResult.errors[0].message}`
    );
  }

  // checking validation errors
  errors = apiResult.data.createContentType.errors;
  if (errors && errors.length > 0) {
    throw new Error(
      `Error in creating ${apiId} content type: ${apiResult.errors[0].message}`
    );
  }
  console.log(`${apiId} content type was successfully created.`);

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

  console.log(`Creating ${contentTypeApiId}.${apiId} field...`);

  const fieldInputWithoutValidations = { ...fieldInput };
  delete fieldInputWithoutValidations.validations;

  const apiResult = await callCreateField({
    field: fieldInputWithoutValidations,
    contentTypeId,
  });

  // checking standard GraphQL errors
  let errors = apiResult.errors;
  if (errors && errors.length > 0) {
    throw new Error(
      `Error in creating ${contentTypeApiId}.${apiId} field: ${
        apiResult.errors[0].message
      }`
    );
  }

  // checking validations errors
  errors = apiResult.data.errors;
  if (errors && errors.length > 0) {
    throw new Error(
      `Error in creating ${contentTypeApiId}.${apiId} field: ${
        apiResult.errors[0].message
      }`
    );
  }

  const field: Field = {
    id: apiResult.data.createField.field.id,
    ...fieldInput,
  };

  for (let fieldValidationInput of validations) {
    await createFieldValidation(contentType, field, fieldValidationInput);
  }

  console.log(`${contentTypeApiId}.${apiId} field was successfully created.`);

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

  console.log(
    `Creating ${contentTypeApiId}.${fieldApiId}.${type} validation...`
  );

  const apiResult = await callCreateFieldValidation({
    fieldId,
    fieldValidation: fieldValidationInput,
  });

  // checking standard GraphQL errors
  let errors = apiResult.errors;
  if (errors && errors.length > 0) {
    throw new Error(
      `Error in creating ${contentTypeApiId}.${fieldApiId}.${type} validation: ${
        apiResult.errors[0].message
      }`
    );
  }

  // checking validations errors
  errors = apiResult.data.errors;
  if (errors && errors.length > 0) {
    throw new Error(
      `Error in creating ${contentTypeApiId}.${fieldApiId}.${type} validation: ${
        apiResult.errors[0].message
      }`
    );
  }

  console.log(
    `${contentTypeApiId}.${fieldApiId}.${type} validation was successfully created.`
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
    return new Promise(done => {
      (async () => {
        for (let contentTypeInput of contentTypeInputs) {
          const contentType = await createContentType(contentTypeInput);
          const { fields = [] } = contentTypeInput;
          for (let fieldInput of fields) {
            await createField(contentType, fieldInput);
          }
        }
        done();
      })();
    });
  } catch (e) {
    console.error(e);
  }
};
