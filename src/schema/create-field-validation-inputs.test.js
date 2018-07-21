const createFieldValidationInputs = require('./create-field-validation-inputs.js');
const parse = require('./parse.js');

describe('createFieldValidationInputs function', () => {
  describe('length validation', () => {
    it('parses the min length validation correctly', () => {
      const schema = `
        type Object implements SimpleContentType {
          field: SinglelineText @validation(minLength: 5, errorMessage: "test err")
        }
      `;
      const { simpleContentTypes } = parse(schema);
      const field = simpleContentTypes[0].fields[0];

      const expected = [
        {
          type: 'MIN_LENGTH',
          config: { lengthMin: 5 },
          errorMessage: 'test err',
        },
      ];

      expect(createFieldValidationInputs(field)).toEqual(expected);
    });

    it('parses the max length validation correctly', () => {
      const schema = `
        type Object implements SimpleContentType {
          field: SinglelineText @validation(maxLength: 5, errorMessage: "test err")
        }
      `;
      const { simpleContentTypes } = parse(schema);
      const field = simpleContentTypes[0].fields[0];

      const expected = [
        {
          type: 'MAX_LENGTH',
          config: { lengthMax: 5 },
          errorMessage: 'test err',
        },
      ];

      expect(createFieldValidationInputs(field)).toEqual(expected);
    });

    it('parses the min/max length validation correctly', () => {
      const schema = `
        type Object implements SimpleContentType {
          field: SinglelineText @validation(minLength: 5, maxLength: 10, errorMessage: "test err")
        }
      `;
      const { simpleContentTypes } = parse(schema);
      const field = simpleContentTypes[0].fields[0];

      const expected = [
        {
          type: 'MIN_LENGTH',
          config: { lengthMin: 5 },
          errorMessage: 'test err',
        },
        {
          type: 'MAX_LENGTH',
          config: { lengthMax: 10 },
          errorMessage: 'test err',
        },
      ];

      expect(createFieldValidationInputs(field)).toEqual(expected);
    });

    it('parses the min/max length validations separately', () => {
      const schema = `
        type Object implements SimpleContentType {
          field: SinglelineText @validation(minLength: 5, errorMessage: "test err") @validation(maxLength: 10, errorMessage: "test err 2")
        }
      `;
      const { simpleContentTypes } = parse(schema);
      const field = simpleContentTypes[0].fields[0];

      const expected = [
        {
          type: 'MIN_LENGTH',
          config: { lengthMin: 5 },
          errorMessage: 'test err',
        },
        {
          type: 'MAX_LENGTH',
          config: { lengthMax: 10 },
          errorMessage: 'test err 2',
        },
      ];

      expect(createFieldValidationInputs(field)).toEqual(expected);
    });

    it('returns an empty array if min/max is not set', () => {
      const schema = `
        type Object implements SimpleContentType {
          field: SinglelineText @validation(errorMessage: "test err")
        }
      `;
      const { simpleContentTypes } = parse(schema);
      const field = simpleContentTypes[0].fields[0];

      expect(createFieldValidationInputs(field)).toEqual([]);
    });

    it('throws an error if min is greater than max', () => {
      const schema = `
        type Object implements SimpleContentType {
          field: SinglelineText @validation(minLength: 5, maxLength: 4, errorMessage: "test err")
        }
      `;
      const { simpleContentTypes } = parse(schema);
      const field = simpleContentTypes[0].fields[0];
      expect(() => createFieldValidationInputs(field)).toThrow({
        message: 'maxLength should be equal or greater than minLength',
        locations: [{ line: 3, column: 70 }],
      });
    });
  });
});
