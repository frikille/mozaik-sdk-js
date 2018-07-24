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

  it('generates a default error message ', () => {
    const schema = `
      type Object implements SimpleContentType {
        field1: ${fieldType} @validation(minLength: 5)
        field2: ${fieldType} @validation(maxLength: 10)
        field3: ${fieldType} @validation(minLength: 5, maxLength: 10)
      }
    `;
    const { simpleContentTypes } = parse(schema);
    const fields = simpleContentTypes[0].fields;
    expect(createFieldValidationInputs(fields[0])[0].errorMessage).toEqual(
      'should be at least 5 characters long'
    );
    expect(createFieldValidationInputs(fields[1])[0].errorMessage).toEqual(
      'should be maximum 10 characters long'
    );
    expect(createFieldValidationInputs(fields[2])[0].errorMessage).toEqual(
      'should have a length between 5 and 10 characters'
    );
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

const patternValidation = fieldType => {
  it('parses the pattern correctly', () => {
    const schema = `
      type Object implements SimpleContentType {
        field: ${fieldType} @validation(pattern: "[a-z]+", errorMessage: "test err")
      }
    `;
    const { simpleContentTypes } = parse(schema);
    const field = simpleContentTypes[0].fields[0];

    const expected = [
      {
        type: 'PATTERN',
        config: { pattern: '[a-z]+' },
        errorMessage: 'test err',
      },
    ];

    expect(createFieldValidationInputs(field)).toEqual(expected);
  });

  it('generates a default error message', () => {
    const schema = `
      type Object implements SimpleContentType {
        field: ${fieldType} @validation(pattern: "[a-z]+")
      }
    `;
    const { simpleContentTypes } = parse(schema);
    const field = simpleContentTypes[0].fields[0];
    expect(createFieldValidationInputs(field)[0].errorMessage).toEqual(
      'should match [a-z]+'
    );
  });

  it('returns an empty array if pattern is not set', () => {
    const schema = `
      type Object implements SimpleContentType {
        field: ${fieldType} @validation(errorMessage: "test err")
      }
    `;
    const { simpleContentTypes } = parse(schema);
    const field = simpleContentTypes[0].fields[0];

    expect(createFieldValidationInputs(field)).toEqual([]);
  });

  it('throws an error if pattern is empty', () => {
    const paddedFieldType = fieldType.padStart(18);
    const schema = `
      type Object implements SimpleContentType {
        field: ${paddedFieldType} @validation(pattern: "", errorMessage: "test err")
      }
    `;
    const { simpleContentTypes } = parse(schema);
    const field = simpleContentTypes[0].fields[0];
    expect(() => createFieldValidationInputs(field)).toThrow({
      message: 'pattern should not be empty',
      locations: [{ line: 3, column: 56 }],
    });
  });

  it('throws an error if pattern has the wrong type', () => {
    const paddedFieldType = fieldType.padStart(18);
    const schema = `
      type Object implements SimpleContentType {
        field: ${paddedFieldType} @validation(pattern: 5, errorMessage: "test err")
      }
    `;
    const { simpleContentTypes } = parse(schema);
    const field = simpleContentTypes[0].fields[0];
    expect(() => createFieldValidationInputs(field)).toThrow({
      message: 'was expecting String',
      locations: [{ line: 3, column: 56 }],
    });
  });

  it('throws an error if pattern is not a valid regexp', () => {
    const paddedFieldType = fieldType.padStart(18);
    const schema = `
      type Object implements SimpleContentType {
        field: ${paddedFieldType} @validation(pattern: "[a-z", errorMessage: "test err")
      }
    `;
    const { simpleContentTypes } = parse(schema);
    const field = simpleContentTypes[0].fields[0];
    expect(() => createFieldValidationInputs(field)).toThrow({
      message:
        'Invalid regular expression: /[a-z/: Unterminated character class',
      locations: [{ line: 3, column: 56 }],
    });
  });
};

const fileTypeValidation = fieldType => {
  it('parses the fileType correctly', () => {
    const schema = `
      type Object implements SimpleContentType {
        field: ${fieldType} @validation(fileType: "pdf", errorMessage: "test err")
      }
    `;
    const { simpleContentTypes } = parse(schema);
    const field = simpleContentTypes[0].fields[0];

    const expected = [
      {
        type: 'FILE_TYPE',
        config: { fileType: 'pdf' },
        errorMessage: 'test err',
      },
    ];

    expect(createFieldValidationInputs(field)).toEqual(expected);
  });

  it('generates a default error message', () => {
    const schema = `
      type Object implements SimpleContentType {
        field: ${fieldType} @validation(fileType: "pdf")
      }
    `;
    const { simpleContentTypes } = parse(schema);
    const field = simpleContentTypes[0].fields[0];
    expect(createFieldValidationInputs(field)[0].errorMessage).toEqual(
      'invalid file type, it should be pdf'
    );
  });

  it('returns an empty array if fileType is not set', () => {
    const schema = `
      type Object implements SimpleContentType {
        field: ${fieldType} @validation(errorMessage: "test err")
      }
    `;
    const { simpleContentTypes } = parse(schema);
    const field = simpleContentTypes[0].fields[0];

    expect(createFieldValidationInputs(field)).toEqual([]);
  });

  it('throws an error if fileType is empty', () => {
    const paddedFieldType = fieldType.padStart(18);
    const schema = `
      type Object implements SimpleContentType {
        field: ${paddedFieldType} @validation(fileType: "", errorMessage: "test err")
      }
    `;
    const { simpleContentTypes } = parse(schema);
    const field = simpleContentTypes[0].fields[0];
    expect(() => createFieldValidationInputs(field)).toThrow({
      message: 'file type can not be empty',
      locations: [{ line: 3, column: 57 }],
    });
  });

  it('throws an error if fileType has the wrong type', () => {
    const paddedFieldType = fieldType.padStart(18);
    const schema = `
      type Object implements SimpleContentType {
        field: ${paddedFieldType} @validation(fileType: 5, errorMessage: "test err")
      }
    `;
    const { simpleContentTypes } = parse(schema);
    const field = simpleContentTypes[0].fields[0];
    expect(() => createFieldValidationInputs(field)).toThrow({
      message: 'was expecting String',
      locations: [{ line: 3, column: 57 }],
    });
  });
};

const maxFileSizeValidation = fieldType => {
  it('parses the max file size correctly', () => {
    const schema = `
      type Object implements SimpleContentType {
        field: ${fieldType} @validation(maxSize: 100, errorMessage: "test err")
      }
    `;
    const { simpleContentTypes } = parse(schema);
    const field = simpleContentTypes[0].fields[0];

    const expected = [
      {
        type: 'MAX_FILE_SIZE',
        config: { maxFileSize: 100 },
        errorMessage: 'test err',
      },
    ];

    expect(createFieldValidationInputs(field)).toEqual(expected);
  });

  it('generates a default error message', () => {
    const schema = `
      type Object implements SimpleContentType {
        field: ${fieldType} @validation(maxSize: 100)
      }
    `;
    const { simpleContentTypes } = parse(schema);
    const field = simpleContentTypes[0].fields[0];
    expect(createFieldValidationInputs(field)[0].errorMessage).toEqual(
      'the file size should not exceed 100 kB'
    );
  });

  it('returns an empty array if maxSize is not set', () => {
    const schema = `
      type Object implements SimpleContentType {
        field: ${fieldType} @validation(errorMessage: "test err")
      }
    `;
    const { simpleContentTypes } = parse(schema);
    const field = simpleContentTypes[0].fields[0];

    expect(createFieldValidationInputs(field)).toEqual([]);
  });

  it('throws an error if maxSize has the wrong type', () => {
    const paddedFieldType = fieldType.padStart(18);
    const schema = `
      type Object implements SimpleContentType {
        field: ${paddedFieldType} @validation(maxSize: "not a number", errorMessage: "test err")
      }
    `;
    const { simpleContentTypes } = parse(schema);
    const field = simpleContentTypes[0].fields[0];
    expect(() => createFieldValidationInputs(field)).toThrow({
      message: 'was expecting Int',
      locations: [{ line: 3, column: 56 }],
    });
  });

  it('throws an error if maxSize is not a positive integer', () => {
    const paddedFieldType = fieldType.padStart(18);
    const schema = `
      type Object implements SimpleContentType {
        field: ${paddedFieldType} @validation(maxSize: 0, errorMessage: "test err")
      }
    `;
    const { simpleContentTypes } = parse(schema);
    const field = simpleContentTypes[0].fields[0];
    expect(() => createFieldValidationInputs(field)).toThrow({
      message: 'was expecting a positive integer',
      locations: [{ line: 3, column: 56 }],
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

  describe('pattern validation on ID field', () => patternValidation('ID'));

  describe('pattern validation on String field', () =>
    patternValidation('String'));

  describe('pattern validation on SinglelineText field', () =>
    patternValidation('SinglelineText'));

  describe('pattern validation on MultilineText field', () =>
    patternValidation('MultilineText'));

  describe('pattern validation on RichText field', () =>
    patternValidation('RichText'));

  describe('file type validation on Image field', () =>
    fileTypeValidation('Image'));

  describe('file type validation on Video field', () =>
    fileTypeValidation('Video'));

  describe('file type validation on Audio field', () =>
    fileTypeValidation('Audio'));

  describe('file type validation on File field', () =>
    fileTypeValidation('File'));

  describe('max file size validation on Image field', () =>
    maxFileSizeValidation('Image'));

  describe('max file size validation on Video field', () =>
    maxFileSizeValidation('Video'));

  describe('max file size validation on Audio field', () =>
    maxFileSizeValidation('Audio'));

  describe('max file size validation on File field', () =>
    maxFileSizeValidation('File'));

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
          type: 'VALUE_RANGE',
          config: { valueMinInt: 5, valueMaxInt: 10 },
          errorMessage: 'test err',
        },
      ];

      expect(createFieldValidationInputs(field)).toEqual(expected);
    });

    it('generates a default error message ', () => {
      const schema = `
        type Object implements SimpleContentType {
          field1: Int @validation(min: 5)
          field2: Int @validation(max: 10)
          field3: Int @validation(min: 5, max: 10)
        }
      `;
      const { simpleContentTypes } = parse(schema);
      const fields = simpleContentTypes[0].fields;
      expect(createFieldValidationInputs(fields[0])[0].errorMessage).toEqual(
        'should be greater than or equal to 5'
      );
      expect(createFieldValidationInputs(fields[1])[0].errorMessage).toEqual(
        'should be less than or equal to 10'
      );
      expect(createFieldValidationInputs(fields[2])[0].errorMessage).toEqual(
        'should be between 5 and 10'
      );
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
          type: 'VALUE_RANGE',
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
          type: 'VALUE_RANGE',
          config: { valueMinFloat: 5.1, valueMaxFloat: 10.1 },
          errorMessage: 'test err',
        },
      ];

      expect(createFieldValidationInputs(field)).toEqual(expected);
    });

    it('generates a default error message ', () => {
      const schema = `
        type Object implements SimpleContentType {
          field1: Float @validation(min: 5.1)
          field2: Float @validation(max: 10.1)
          field3: Float @validation(min: 5.1, max: 10.1)
        }
      `;
      const { simpleContentTypes } = parse(schema);
      const fields = simpleContentTypes[0].fields;
      expect(createFieldValidationInputs(fields[0])[0].errorMessage).toEqual(
        'should be greater than or equal to 5.1'
      );
      expect(createFieldValidationInputs(fields[1])[0].errorMessage).toEqual(
        'should be less than or equal to 10.1'
      );
      expect(createFieldValidationInputs(fields[2])[0].errorMessage).toEqual(
        'should be between 5.1 and 10.1'
      );
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
          type: 'VALUE_RANGE',
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
          type: 'VALUE_RANGE',
          config: { dateMin: '1985-10-26', dateMax: '2015-10-21' },
          errorMessage: 'test err',
        },
      ];

      expect(createFieldValidationInputs(field)).toEqual(expected);
    });

    it('generates a default error message ', () => {
      const schema = `
        type Object implements SimpleContentType {
          field1: Date @validation(min: "1985-10-26")
          field2: Date @validation(max: "2015-10-21")
          field3: Date @validation(min: "1985-10-26", max: "2015-10-21")
        }
      `;
      const { simpleContentTypes } = parse(schema);
      const fields = simpleContentTypes[0].fields;
      expect(createFieldValidationInputs(fields[0])[0].errorMessage).toEqual(
        'should be greater than or equal to 1985-10-26'
      );
      expect(createFieldValidationInputs(fields[1])[0].errorMessage).toEqual(
        'should be less than or equal to 2015-10-21'
      );
      expect(createFieldValidationInputs(fields[2])[0].errorMessage).toEqual(
        'should be between 1985-10-26 and 2015-10-21'
      );
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
          type: 'VALUE_RANGE',
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

  describe('min/max validation on DateTime field', () => {
    it('parses the min value validation correctly', () => {
      const schema = `
        type Object implements SimpleContentType {
          field: DateTime @validation(min: "1985-10-26T09:00:00.000Z", errorMessage: "test err")
        }
      `;
      const { simpleContentTypes } = parse(schema);
      const field = simpleContentTypes[0].fields[0];

      const expected = [
        {
          type: 'MIN_VALUE',
          config: { dateTimeMin: '1985-10-26T09:00:00.000Z' },
          errorMessage: 'test err',
        },
      ];

      expect(createFieldValidationInputs(field)).toEqual(expected);
    });

    it('parses the max value validation correctly', () => {
      const schema = `
        type Object implements SimpleContentType {
          field: DateTime @validation(max: "2015-10-21T07:28:00.000Z", errorMessage: "test err")
        }
      `;
      const { simpleContentTypes } = parse(schema);
      const field = simpleContentTypes[0].fields[0];

      const expected = [
        {
          type: 'MAX_VALUE',
          config: { dateTimeMax: '2015-10-21T07:28:00.000Z' },
          errorMessage: 'test err',
        },
      ];

      expect(createFieldValidationInputs(field)).toEqual(expected);
    });

    it('parses the min/max value validation correctly', () => {
      const schema = `
        type Object implements SimpleContentType {
          field: DateTime @validation(min: "1985-10-26T09:00:00.000Z", max: "2015-10-21T07:28:00.000Z", errorMessage: "test err")
        }
      `;
      const { simpleContentTypes } = parse(schema);
      const field = simpleContentTypes[0].fields[0];

      const expected = [
        {
          type: 'VALUE_RANGE',
          config: {
            dateTimeMin: '1985-10-26T09:00:00.000Z',
            dateTimeMax: '2015-10-21T07:28:00.000Z',
          },
          errorMessage: 'test err',
        },
      ];

      expect(createFieldValidationInputs(field)).toEqual(expected);
    });

    it('generates a default error message ', () => {
      const schema = `
        type Object implements SimpleContentType {
          field1: DateTime @validation(min: "1985-10-26T09:00:00.000Z")
          field2: DateTime @validation(max: "2015-10-21T07:28:00.000Z")
          field3: DateTime @validation(min: "1985-10-26T09:00:00.000Z", max: "2015-10-21T07:28:00.000Z")
        }
      `;
      const { simpleContentTypes } = parse(schema);
      const fields = simpleContentTypes[0].fields;
      expect(createFieldValidationInputs(fields[0])[0].errorMessage).toEqual(
        'should be greater than or equal to 1985-10-26T09:00:00.000Z'
      );
      expect(createFieldValidationInputs(fields[1])[0].errorMessage).toEqual(
        'should be less than or equal to 2015-10-21T07:28:00.000Z'
      );
      expect(createFieldValidationInputs(fields[2])[0].errorMessage).toEqual(
        'should be between 1985-10-26T09:00:00.000Z and 2015-10-21T07:28:00.000Z'
      );
    });

    it('allows the same min/max value', () => {
      const schema = `
        type Object implements SimpleContentType {
          field: DateTime @validation(min: "1985-10-26T09:00:00.000Z", max: "1985-10-26T09:00:00.000Z", errorMessage: "test err")
        }
      `;
      const { simpleContentTypes } = parse(schema);
      const field = simpleContentTypes[0].fields[0];

      const expected = [
        {
          type: 'VALUE_RANGE',
          config: {
            dateTimeMin: '1985-10-26T09:00:00.000Z',
            dateTimeMax: '1985-10-26T09:00:00.000Z',
          },
          errorMessage: 'test err',
        },
      ];

      expect(createFieldValidationInputs(field)).toEqual(expected);
    });

    it('parses the min/max value validations separately', () => {
      const schema = `
        type Object implements SimpleContentType {
          field: DateTime @validation(min: "1985-10-26T09:00:00.000Z", errorMessage: "test err") @validation(max: "2015-10-21T07:28:00.000Z", errorMessage: "test err 2")
        }
      `;
      const { simpleContentTypes } = parse(schema);
      const field = simpleContentTypes[0].fields[0];

      const expected = [
        {
          type: 'MIN_VALUE',
          config: { dateTimeMin: '1985-10-26T09:00:00.000Z' },
          errorMessage: 'test err',
        },
        {
          type: 'MAX_VALUE',
          config: { dateTimeMax: '2015-10-21T07:28:00.000Z' },
          errorMessage: 'test err 2',
        },
      ];

      expect(createFieldValidationInputs(field)).toEqual(expected);
    });

    it('returns an empty array if min/max is not set', () => {
      const schema = `
        type Object implements SimpleContentType {
          field: DateTime @validation(errorMessage: "test err")
        }
      `;
      const { simpleContentTypes } = parse(schema);
      const field = simpleContentTypes[0].fields[0];

      expect(createFieldValidationInputs(field)).toEqual([]);
    });

    it('throws an error if min is greater than max', () => {
      const schema = `
        type Object implements SimpleContentType {
          field: DateTime @validation(min: "1985-10-26T09:00:00.000Z", max: "1985-10-26T08:00:00.000Z", errorMessage: "test err")
        }
      `;
      const { simpleContentTypes } = parse(schema);
      const field = simpleContentTypes[0].fields[0];
      expect(() => createFieldValidationInputs(field)).toThrow({
        message: 'max should be equal or greater than min',
        locations: [{ line: 3, column: 77 }],
      });
    });

    it('throws an error if min is the wrong type', () => {
      const schema = `
        type Object implements SimpleContentType {
          field: DateTime @validation(min: 123, errorMessage: "test err")
        }
      `;
      const { simpleContentTypes } = parse(schema);
      const field = simpleContentTypes[0].fields[0];
      expect(() => createFieldValidationInputs(field)).toThrow({
        message: 'was expecting String',
        locations: [{ line: 3, column: 44 }],
      });
    });

    it('throws an error if min has an invalid date', () => {
      const schema = `
        type Object implements SimpleContentType {
          field: DateTime @validation(min: "not a date", errorMessage: "test err")
        }
      `;
      const { simpleContentTypes } = parse(schema);
      const field = simpleContentTypes[0].fields[0];
      expect(() => createFieldValidationInputs(field)).toThrow({
        message: 'invalid date',
        locations: [{ line: 3, column: 44 }],
      });
    });

    it('throws an error if max is the wrong type', () => {
      const schema = `
        type Object implements SimpleContentType {
          field: DateTime @validation(max: 123, errorMessage: "test err")
        }
      `;
      const { simpleContentTypes } = parse(schema);
      const field = simpleContentTypes[0].fields[0];
      expect(() => createFieldValidationInputs(field)).toThrow({
        message: 'was expecting String',
        locations: [{ line: 3, column: 44 }],
      });
    });

    it('throws an error if max has an invalid date', () => {
      const schema = `
        type Object implements SimpleContentType {
          field: DateTime @validation(max: "not a date", errorMessage: "test err")
        }
      `;
      const { simpleContentTypes } = parse(schema);
      const field = simpleContentTypes[0].fields[0];
      expect(() => createFieldValidationInputs(field)).toThrow({
        message: 'invalid date',
        locations: [{ line: 3, column: 44 }],
      });
    });
  });

  describe('image max width validation on Image field', () => {
    it('parses the max width value validation correctly', () => {
      const schema = `
        type Object implements SimpleContentType {
          field: Image @validation(maxWidth: 100, errorMessage: "test err")
        }
      `;
      const { simpleContentTypes } = parse(schema);
      const field = simpleContentTypes[0].fields[0];

      const expected = [
        {
          type: 'IMAGE_WIDTH',
          config: { imageWidth: 100 },
          errorMessage: 'test err',
        },
      ];

      expect(createFieldValidationInputs(field)).toEqual(expected);
    });

    it('returns an empty array if max width is not set', () => {
      const schema = `
        type Object implements SimpleContentType {
          field: Image @validation(errorMessage: "test err")
        }
      `;
      const { simpleContentTypes } = parse(schema);
      const field = simpleContentTypes[0].fields[0];

      expect(createFieldValidationInputs(field)).toEqual([]);
    });

    it('throws an error if max width is the wrong type', () => {
      const schema = `
        type Object implements SimpleContentType {
          field: Image @validation(maxWidth: "not a number", errorMessage: "test err")
        }
      `;
      const { simpleContentTypes } = parse(schema);
      const field = simpleContentTypes[0].fields[0];
      expect(() => createFieldValidationInputs(field)).toThrow({
        message: 'was expecting Int',
        locations: [{ line: 3, column: 46 }],
      });
    });

    it('throws an error if max width is not positive', () => {
      const schema = `
        type Object implements SimpleContentType {
          field: Image @validation(maxWidth: 0, errorMessage: "test err")
        }
      `;
      const { simpleContentTypes } = parse(schema);
      const field = simpleContentTypes[0].fields[0];
      expect(() => createFieldValidationInputs(field)).toThrow({
        message: 'was expecting a positive integer',
        locations: [{ line: 3, column: 46 }],
      });
    });
  });

  describe('image max height validation on Image field', () => {
    it('parses the max height value validation correctly', () => {
      const schema = `
        type Object implements SimpleContentType {
          field: Image @validation(maxHeight: 100, errorMessage: "test err")
        }
      `;
      const { simpleContentTypes } = parse(schema);
      const field = simpleContentTypes[0].fields[0];

      const expected = [
        {
          type: 'IMAGE_HEIGHT',
          config: { imageHeight: 100 },
          errorMessage: 'test err',
        },
      ];

      expect(createFieldValidationInputs(field)).toEqual(expected);
    });

    it('returns an empty array if max height is not set', () => {
      const schema = `
        type Object implements SimpleContentType {
          field: Image @validation(errorMessage: "test err")
        }
      `;
      const { simpleContentTypes } = parse(schema);
      const field = simpleContentTypes[0].fields[0];

      expect(createFieldValidationInputs(field)).toEqual([]);
    });

    it('throws an error if max height is the wrong type', () => {
      const schema = `
        type Object implements SimpleContentType {
          field: Image @validation(maxHeight: "not a number", errorMessage: "test err")
        }
      `;
      const { simpleContentTypes } = parse(schema);
      const field = simpleContentTypes[0].fields[0];
      expect(() => createFieldValidationInputs(field)).toThrow({
        message: 'was expecting Int',
        locations: [{ line: 3, column: 47 }],
      });
    });

    it('throws an error if max height is not positive', () => {
      const schema = `
        type Object implements SimpleContentType {
          field: Image @validation(maxHeight: 0, errorMessage: "test err")
        }
      `;
      const { simpleContentTypes } = parse(schema);
      const field = simpleContentTypes[0].fields[0];
      expect(() => createFieldValidationInputs(field)).toThrow({
        message: 'was expecting a positive integer',
        locations: [{ line: 3, column: 47 }],
      });
    });
  });
});
