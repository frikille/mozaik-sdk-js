// @flow
/* eslint-disable no-console */
import type { ContentType } from '../content-types/index.js';
import type { ContentTypeInput } from '../content-types/create/index.js';
import type { Field } from '../fields/index.js';

const createContentType = require('./../content-types/create/index.js');
const createField = require('./../fields/create/index.js');

async function createContentTypes(
  contentTypeInputs: Array<ContentTypeInput>
): Promise<Array<ContentType>> {
  return await Promise.all(
    contentTypeInputs.map(async contentTypeInput => {
      const { apiId } = contentTypeInput;

      console.log(`Creating ${apiId} content type...`);

      const contentTypeWithoutFields = { ...contentTypeInput };
      contentTypeWithoutFields.fields = [];

      const apiResult = await createContentType({
        contentType: contentTypeWithoutFields,
      });

      console.log(apiResult);

      // checking GraphQL errors
      let errors = apiResult.errors;
      if (errors && errors.length > 0) {
        throw new Error(
          `Error in creating ${apiId} content type: ${
            apiResult.errors[0].message
          }`
        );
      }

      // checking validation errors
      errors = apiResult.data.createContentType.errors;
      if (errors && errors.length > 0) {
        throw new Error(
          `Error in creating ${apiId} content type: ${
            apiResult.errors[0].message
          }`
        );
      }
      console.log(`${apiId} content type was successfully created.`);

      return {
        id: apiResult.data.createContentType.contentType.id,
        ...contentTypeInput,
      };
    })
  );
}

async function createFields(contentType: ContentType): Promise<Array<Field>> {
  const {
    id: contentTypeId,
    apiId: contentTypeApiId,
    fields: fieldInputs = [],
  } = contentType;

  return await Promise.all(
    fieldInputs.map(async fieldInput => {
      const { apiId } = fieldInput;

      console.log(`Creating ${contentTypeApiId}.${apiId} field...`);

      const apiResult = await createField({
        field: fieldInput,
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

      console.log(
        `${contentTypeApiId}.${apiId} field was successfully created.`
      );

      return {
        id: apiResult.data.createField.field.id,
        ...fieldInput,
      };
    })
  );
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index]);
  }
}

module.exports = async function apply(
  contentTypeInputs: Array<ContentTypeInput>
) {
  try {
    const contentTypes = await createContentTypes(contentTypeInputs);

    return new Promise(done => {
      (async () => {
        await asyncForEach(contentTypes, async contentType => {
          await createFields(contentType);
        });
        done();
      })();
    });
  } catch (e) {
    console.error(e);
  }
};
