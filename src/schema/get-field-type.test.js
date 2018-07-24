const getFieldType = require('./get-field-type.js');
const parse = require('./parse.js');

describe('getFieldType function', () => {
  it('returns the correct field type', () => {
    const schema = `
      type Object implements SimpleContentType {
        field1: String
      }
    `;
    const { simpleContentTypes } = parse(schema);
    const input = simpleContentTypes[0];

    expect(getFieldType(input.fields[0].type)).toEqual({
      type: 'String',
      hasMultipleValues: false,
      required: false,
    });
  });

  it('returns the correct list type', () => {
    const schema = `
      type Object implements SimpleContentType {
        field1: [String]
      }
    `;
    const { simpleContentTypes } = parse(schema);
    const input = simpleContentTypes[0];

    expect(getFieldType(input.fields[0].type)).toEqual({
      type: 'String',
      hasMultipleValues: true,
      required: false,
    });
  });

  it('returns required flag is field has an exclamation mark', () => {
    const schema = `
      type Object implements SimpleContentType {
        field1: String!
      }
    `;
    const { simpleContentTypes } = parse(schema);
    const input = simpleContentTypes[0];

    expect(getFieldType(input.fields[0].type)).toEqual({
      type: 'String',
      hasMultipleValues: false,
      required: true,
    });
  });

  it('returns required flag is list field has an exclamation mark', () => {
    const schema = `
      type Object implements SimpleContentType {
        field1: [String]!
      }
    `;
    const { simpleContentTypes } = parse(schema);
    const input = simpleContentTypes[0];

    expect(getFieldType(input.fields[0].type)).toEqual({
      type: 'String',
      hasMultipleValues: true,
      required: true,
    });
  });

  it('throws an error for list of lists', () => {
    const schema = `
      type Object implements SimpleContentType {
        field1: [[String]]
      }
    `;
    const { simpleContentTypes } = parse(schema);
    const input = simpleContentTypes[0];

    expect(() => getFieldType(input.fields[0].type)).toThrow({
      message: 'list of lists are not allowed',
      locations: [{ line: 3, column: 18 }],
    });
  });
});
