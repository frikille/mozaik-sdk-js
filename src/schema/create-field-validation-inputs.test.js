const createFieldValidationInputs = require('./create-field-validation-inputs.js');
const parse = require('./parse.js');

const lengthValidation = fieldType => {
  it('parses the min length validation correctly', () => {
    const schema = `
      type Object implements SimpleContentType {
        field: ${fieldType} @validation(minLength: 5, errorMessage: "test err")
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
        field: ${fieldType} @validation(maxLength: 5, errorMessage: "test err")
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
        field: ${fieldType} @validation(minLength: 5, maxLength: 10, errorMessage: "test err")
      }
    `;
    const { simpleContentTypes } = parse(schema);
    const field = simpleContentTypes[0].fields[0];

    const expected = [
      {
        type: 'LENGTH_RANGE',
        config: { lengthMin: 5, lengthMax: 10 },
        errorMessage: 'test err',
      },
    ];

    expect(createFieldValidationInputs(field)).toEqual(expected);
  });

  it('allows the same min/max length values', () => {
    const schema = `
      type Object implements SimpleContentType {
        field: ${fieldType} @validation(minLength: 5, maxLength: 5, errorMessage: "test err")
      }
    `;
    const { simpleContentTypes } = parse(schema);
    const field = simpleContentTypes[0].fields[0];

    const expected = [
      {
        type: 'LENGTH_RANGE',
        config: { lengthMin: 5, lengthMax: 5 },
        errorMessage: 'test err',
      },
    ];

    expect(createFieldValidationInputs(field)).toEqual(expected);
  });

  it('parses the min/max length validations separately', () => {
    const schema = `
      type Object implements SimpleContentType {
        field: ${fieldType} @validation(minLength: 5, errorMessage: "test err") @validation(maxLength: 10, errorMessage: "test err 2")
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
        field: ${fieldType} @validation(errorMessage: "test err")
      }
    `;
    const { simpleContentTypes } = parse(schema);
    const field = simpleContentTypes[0].fields[0];

    expect(createFieldValidationInputs(field)).toEqual([]);
  });

  it('throws an error if min is greater than max', () => {
    const paddedFieldType = fieldType.padStart(18);
    const schema = `
      type Object implements SimpleContentType {
        field: ${paddedFieldType} @validation(minLength: 5, maxLength: 4, errorMessage: "test err")
      }
    `;
    const { simpleContentTypes } = parse(schema);
    const field = simpleContentTypes[0].fields[0];
    expect(() => createFieldValidationInputs(field)).toThrow({
      message: 'maxLength should be equal or greater than minLength',
      locations: [{ line: 3, column: 72 }],
    });
  });

  it('throws an error if min length is the wrong type', () => {
    const paddedFieldType = fieldType.padStart(18);
    const schema = `
      type Object implements SimpleContentType {
        field: ${paddedFieldType} @validation(minLength: 5.1, errorMessage: "test err")
      }
    `;
    const { simpleContentTypes } = parse(schema);
    const field = simpleContentTypes[0].fields[0];
    expect(() => createFieldValidationInputs(field)).toThrow({
      message: 'was expecting Int',
      locations: [{ line: 3, column: 58 }],
    });
  });

  it('throws an error if max length is the wrong type', () => {
    const paddedFieldType = fieldType.padStart(18);
    const schema = `
      type Object implements SimpleContentType {
        field: ${paddedFieldType} @validation(maxLength: 5.1, errorMessage: "test err")
      }
    `;
    const { simpleContentTypes } = parse(schema);
    const field = simpleContentTypes[0].fields[0];
    expect(() => createFieldValidationInputs(field)).toThrow({
      message: 'was expecting Int',
      locations: [{ line: 3, column: 58 }],
    });
  });
};

describe('createFieldValidationInputs function', () => {
  describe('length validation on ID field', () => lengthValidation('ID'));

  describe('length validation on String field', () =>
    lengthValidation('String'));

  describe('length validation on SinglelineText field', () =>
    lengthValidation('SinglelineText'));

  describe('length validation on MultilineText field', () =>
    lengthValidation('MultilineText'));

  describe('length validation on RichText field', () =>
    lengthValidation('RichText'));

  describe('min/max validation on Int field', () => {
    it('parses the min value validation correctly', () => {
      const schema = `
        type Object implements SimpleContentType {
          field: Int @validation(min: 5, errorMessage: "test err")
        }
      `;
      const { simpleContentTypes } = parse(schema);
      const field = simpleContentTypes[0].fields[0];

      const expected = [
        {
          type: 'MIN_VALUE',
          config: { valueMinInt: 5 },
          errorMessage: 'test err',
        },
      ];

      expect(createFieldValidationInputs(field)).toEqual(expected);
    });

    it('parses the max value validation correctly', () => {
      const schema = `
        type Object implements SimpleContentType {
          field: Int @validation(max: 5, errorMessage: "test err")
        }
      `;
      const { simpleContentTypes } = parse(schema);
      const field = simpleContentTypes[0].fields[0];

      const expected = [
        {
          type: 'MAX_VALUE',
          config: { valueMaxInt: 5 },
          errorMessage: 'test err',
        },
      ];

      expect(createFieldValidationInputs(field)).toEqual(expected);
    });

    it('parses the min/max value validation correctly', () => {
      const schema = `
        type Object implements SimpleContentType {
          field: Int @validation(min: 5, max: 10, errorMessage: "test err")
        }
      `;
      const { simpleContentTypes } = parse(schema);
      const field = simpleContentTypes[0].fields[0];

      const expected = [
        {
          type: 'RANGE',
          config: { valueMinInt: 5, valueMaxInt: 10 },
          errorMessage: 'test err',
        },
      ];

      expect(createFieldValidationInputs(field)).toEqual(expected);
    });

    it('allows the same min/max value', () => {
      const schema = `
        type Object implements SimpleContentType {
          field: Int @validation(min: 5, max: 5, errorMessage: "test err")
        }
      `;
      const { simpleContentTypes } = parse(schema);
      const field = simpleContentTypes[0].fields[0];

      const expected = [
        {
          type: 'RANGE',
          config: { valueMinInt: 5, valueMaxInt: 5 },
          errorMessage: 'test err',
        },
      ];

      expect(createFieldValidationInputs(field)).toEqual(expected);
    });

    it('parses the min/max value validations separately', () => {
      const schema = `
        type Object implements SimpleContentType {
          field: Int @validation(min: 5, errorMessage: "test err") @validation(max: 10, errorMessage: "test err 2")
        }
      `;
      const { simpleContentTypes } = parse(schema);
      const field = simpleContentTypes[0].fields[0];

      const expected = [
        {
          type: 'MIN_VALUE',
          config: { valueMinInt: 5 },
          errorMessage: 'test err',
        },
        {
          type: 'MAX_VALUE',
          config: { valueMaxInt: 10 },
          errorMessage: 'test err 2',
        },
      ];

      expect(createFieldValidationInputs(field)).toEqual(expected);
    });

    it('returns an empty array if min/max is not set', () => {
      const schema = `
        type Object implements SimpleContentType {
          field: Int @validation(errorMessage: "test err")
        }
      `;
      const { simpleContentTypes } = parse(schema);
      const field = simpleContentTypes[0].fields[0];

      expect(createFieldValidationInputs(field)).toEqual([]);
    });

    it('throws an error if min is greater than max', () => {
      const schema = `
        type Object implements SimpleContentType {
          field: Int @validation(min: 5, max: 4, errorMessage: "test err")
        }
      `;
      const { simpleContentTypes } = parse(schema);
      const field = simpleContentTypes[0].fields[0];
      expect(() => createFieldValidationInputs(field)).toThrow({
        message: 'max should be equal or greater than min',
        locations: [{ line: 3, column: 47 }],
      });
    });

    it('throws an error if min is the wrong type', () => {
      const schema = `
        type Object implements SimpleContentType {
          field: Int @validation(min: 5.1, errorMessage: "test err")
        }
      `;
      const { simpleContentTypes } = parse(schema);
      const field = simpleContentTypes[0].fields[0];
      expect(() => createFieldValidationInputs(field)).toThrow({
        message: 'was expecting Int',
        locations: [{ line: 3, column: 39 }],
      });
    });

    it('throws an error if max is the wrong type', () => {
      const schema = `
        type Object implements SimpleContentType {
          field: Int @validation(max: 5.1, errorMessage: "test err")
        }
      `;
      const { simpleContentTypes } = parse(schema);
      const field = simpleContentTypes[0].fields[0];
      expect(() => createFieldValidationInputs(field)).toThrow({
        message: 'was expecting Int',
        locations: [{ line: 3, column: 39 }],
      });
    });
  });

  describe('min/max validation on Float field', () => {
    it('parses the min value validation correctly', () => {
      const schema = `
        type Object implements SimpleContentType {
          field: Float @validation(min: 5.1, errorMessage: "test err")
        }
      `;
      const { simpleContentTypes } = parse(schema);
      const field = simpleContentTypes[0].fields[0];

      const expected = [
        {
          type: 'MIN_VALUE',
          config: { valueMinFloat: 5.1 },
          errorMessage: 'test err',
        },
      ];

      expect(createFieldValidationInputs(field)).toEqual(expected);
    });

    it('parses the max value validation correctly', () => {
      const schema = `
        type Object implements SimpleContentType {
          field: Float @validation(max: 5.1, errorMessage: "test err")
        }
      `;
      const { simpleContentTypes } = parse(schema);
      const field = simpleContentTypes[0].fields[0];

      const expected = [
        {
          type: 'MAX_VALUE',
          config: { valueMaxFloat: 5.1 },
          errorMessage: 'test err',
        },
      ];

      expect(createFieldValidationInputs(field)).toEqual(expected);
    });

    it('parses the min/max value validation correctly', () => {
      const schema = `
        type Object implements SimpleContentType {
          field: Float @validation(min: 5.1, max: 10.1, errorMessage: "test err")
        }
      `;
      const { simpleContentTypes } = parse(schema);
      const field = simpleContentTypes[0].fields[0];

      const expected = [
        {
          type: 'RANGE',
          config: { valueMinFloat: 5.1, valueMaxFloat: 10.1 },
          errorMessage: 'test err',
        },
      ];

      expect(createFieldValidationInputs(field)).toEqual(expected);
    });

    it('allows the same min/max value', () => {
      const schema = `
        type Object implements SimpleContentType {
          field: Float @validation(min: 5.1, max: 5.1, errorMessage: "test err")
        }
      `;
      const { simpleContentTypes } = parse(schema);
      const field = simpleContentTypes[0].fields[0];

      const expected = [
        {
          type: 'RANGE',
          config: { valueMinFloat: 5.1, valueMaxFloat: 5.1 },
          errorMessage: 'test err',
        },
      ];

      expect(createFieldValidationInputs(field)).toEqual(expected);
    });

    it('parses the min/max value validations separately', () => {
      const schema = `
        type Object implements SimpleContentType {
          field: Float @validation(min: 5.1, errorMessage: "test err") @validation(max: 10.1, errorMessage: "test err 2")
        }
      `;
      const { simpleContentTypes } = parse(schema);
      const field = simpleContentTypes[0].fields[0];

      const expected = [
        {
          type: 'MIN_VALUE',
          config: { valueMinFloat: 5.1 },
          errorMessage: 'test err',
        },
        {
          type: 'MAX_VALUE',
          config: { valueMaxFloat: 10.1 },
          errorMessage: 'test err 2',
        },
      ];

      expect(createFieldValidationInputs(field)).toEqual(expected);
    });

    it('returns an empty array if min/max is not set', () => {
      const schema = `
        type Object implements SimpleContentType {
          field: Float @validation(errorMessage: "test err")
        }
      `;
      const { simpleContentTypes } = parse(schema);
      const field = simpleContentTypes[0].fields[0];

      expect(createFieldValidationInputs(field)).toEqual([]);
    });

    it('throws an error if min is greater than max', () => {
      const schema = `
        type Object implements SimpleContentType {
          field: Float @validation(min: 5.1, max: 4.1, errorMessage: "test err")
        }
      `;
      const { simpleContentTypes } = parse(schema);
      const field = simpleContentTypes[0].fields[0];
      expect(() => createFieldValidationInputs(field)).toThrow({
        message: 'max should be equal or greater than min',
        locations: [{ line: 3, column: 51 }],
      });
    });

    it('throws an error if min is the wrong type', () => {
      const schema = `
        type Object implements SimpleContentType {
          field: Float @validation(min: "wrong", errorMessage: "test err")
        }
      `;
      const { simpleContentTypes } = parse(schema);
      const field = simpleContentTypes[0].fields[0];
      expect(() => createFieldValidationInputs(field)).toThrow({
        message: 'was expecting Float',
        locations: [{ line: 3, column: 41 }],
      });
    });

    it('throws an error if max is the wrong type', () => {
      const schema = `
        type Object implements SimpleContentType {
          field: Float @validation(max: "wrong", errorMessage: "test err")
        }
      `;
      const { simpleContentTypes } = parse(schema);
      const field = simpleContentTypes[0].fields[0];
      expect(() => createFieldValidationInputs(field)).toThrow({
        message: 'was expecting Float',
        locations: [{ line: 3, column: 41 }],
      });
    });
  });

  describe('min/max validation on Date field', () => {
    it('parses the min value validation correctly', () => {
      const schema = `
        type Object implements SimpleContentType {
          field: Date @validation(min: "1985-10-26", errorMessage: "test err")
        }
      `;
      const { simpleContentTypes } = parse(schema);
      const field = simpleContentTypes[0].fields[0];

      const expected = [
        {
          type: 'MIN_VALUE',
          config: { dateMin: '1985-10-26' },
          errorMessage: 'test err',
        },
      ];

      expect(createFieldValidationInputs(field)).toEqual(expected);
    });

    it('parses the max value validation correctly', () => {
      const schema = `
        type Object implements SimpleContentType {
          field: Date @validation(max: "2015-10-21", errorMessage: "test err")
        }
      `;
      const { simpleContentTypes } = parse(schema);
      const field = simpleContentTypes[0].fields[0];

      const expected = [
        {
          type: 'MAX_VALUE',
          config: { dateMax: '2015-10-21' },
          errorMessage: 'test err',
        },
      ];

      expect(createFieldValidationInputs(field)).toEqual(expected);
    });

    it('parses the min/max value validation correctly', () => {
      const schema = `
        type Object implements SimpleContentType {
          field: Date @validation(min: "1985-10-26", max: "2015-10-21", errorMessage: "test err")
        }
      `;
      const { simpleContentTypes } = parse(schema);
      const field = simpleContentTypes[0].fields[0];

      const expected = [
        {
          type: 'RANGE',
          config: { dateMin: '1985-10-26', dateMax: '2015-10-21' },
          errorMessage: 'test err',
        },
      ];

      expect(createFieldValidationInputs(field)).toEqual(expected);
    });

    it('allows the same min/max value', () => {
      const schema = `
        type Object implements SimpleContentType {
          field: Date @validation(min: "1985-10-26", max: "1985-10-26", errorMessage: "test err")
        }
      `;
      const { simpleContentTypes } = parse(schema);
      const field = simpleContentTypes[0].fields[0];

      const expected = [
        {
          type: 'RANGE',
          config: { dateMin: '1985-10-26', dateMax: '1985-10-26' },
          errorMessage: 'test err',
        },
      ];

      expect(createFieldValidationInputs(field)).toEqual(expected);
    });

    it('parses the min/max value validations separately', () => {
      const schema = `
        type Object implements SimpleContentType {
          field: Date @validation(min: "1985-10-26", errorMessage: "test err") @validation(max: "2015-10-21", errorMessage: "test err 2")
        }
      `;
      const { simpleContentTypes } = parse(schema);
      const field = simpleContentTypes[0].fields[0];

      const expected = [
        {
          type: 'MIN_VALUE',
          config: { dateMin: '1985-10-26' },
          errorMessage: 'test err',
        },
        {
          type: 'MAX_VALUE',
          config: { dateMax: '2015-10-21' },
          errorMessage: 'test err 2',
        },
      ];

      expect(createFieldValidationInputs(field)).toEqual(expected);
    });

    it('returns an empty array if min/max is not set', () => {
      const schema = `
        type Object implements SimpleContentType {
          field: Date @validation(errorMessage: "test err")
        }
      `;
      const { simpleContentTypes } = parse(schema);
      const field = simpleContentTypes[0].fields[0];

      expect(createFieldValidationInputs(field)).toEqual([]);
    });

    it('throws an error if min is greater than max', () => {
      const schema = `
        type Object implements SimpleContentType {
          field: Date @validation(min: "1985-10-26", max: "1985-10-25", errorMessage: "test err")
        }
      `;
      const { simpleContentTypes } = parse(schema);
      const field = simpleContentTypes[0].fields[0];
      expect(() => createFieldValidationInputs(field)).toThrow({
        message: 'max should be equal or greater than min',
        locations: [{ line: 3, column: 59 }],
      });
    });

    it('throws an error if min is the wrong type', () => {
      const schema = `
        type Object implements SimpleContentType {
          field: Date @validation(min: 123, errorMessage: "test err")
        }
      `;
      const { simpleContentTypes } = parse(schema);
      const field = simpleContentTypes[0].fields[0];
      expect(() => createFieldValidationInputs(field)).toThrow({
        message: 'was expecting String',
        locations: [{ line: 3, column: 40 }],
      });
    });

    it('throws an error if min has an invalid date', () => {
      const schema = `
        type Object implements SimpleContentType {
          field: Date @validation(min: "not a date", errorMessage: "test err")
        }
      `;
      const { simpleContentTypes } = parse(schema);
      const field = simpleContentTypes[0].fields[0];
      expect(() => createFieldValidationInputs(field)).toThrow({
        message: 'invalid date',
        locations: [{ line: 3, column: 40 }],
      });
    });

    it('throws an error if max is the wrong type', () => {
      const schema = `
        type Object implements SimpleContentType {
          field: Date @validation(max: 123, errorMessage: "test err")
        }
      `;
      const { simpleContentTypes } = parse(schema);
      const field = simpleContentTypes[0].fields[0];
      expect(() => createFieldValidationInputs(field)).toThrow({
        message: 'was expecting String',
        locations: [{ line: 3, column: 40 }],
      });
    });

    it('throws an error if max has an invalid date', () => {
      const schema = `
        type Object implements SimpleContentType {
          field: Date @validation(max: "not a date", errorMessage: "test err")
        }
      `;
      const { simpleContentTypes } = parse(schema);
      const field = simpleContentTypes[0].fields[0];
      expect(() => createFieldValidationInputs(field)).toThrow({
        message: 'invalid date',
        locations: [{ line: 3, column: 40 }],
      });
    });
  });
});
