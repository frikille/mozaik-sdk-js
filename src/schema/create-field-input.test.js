const createFieldInput = require('./create-field-input');
const parse = require('./parse.js');

describe('createFieldInput function', () => {
  describe('NamedType', () => {
    it('returns the correct FieldInput object', () => {
      const schema = `
        type Object implements SimpleContentType {
          twitter: SinglelineText
        }
      `;
      const { simpleContentTypes } = parse(schema);
      const input = simpleContentTypes[0].fields[0];

      const output = {
        label: 'Twitter',
        apiId: 'twitter',
        type: 'TEXT_SINGLELINE',
        hasMultipleValues: false,
      };

      expect(createFieldInput(input)).toEqual(output);
    });

    it('converts the user type to an uppercased name', () => {
      const schema = `
        type FeaturedPost implements SimpleContentType {
          title: String
        }

        type FeaturePostComment implements SimpleContentType {
          post: FeaturedPost
          content: String
        }
      `;
      const { simpleContentTypes } = parse(schema);
      const input = simpleContentTypes[1].fields[0];

      const output = {
        label: 'Post',
        apiId: 'post',
        type: 'FEATURED_POST',
        hasMultipleValues: false,
      };

      expect(createFieldInput(input)).toEqual(output);
    });
  });

  describe('ListType', () => {
    it('returns the correct FieldInput object', () => {
      const schema = `
        type Object implements SimpleContentType {
          tags: [SinglelineText]
        }
      `;
      const { simpleContentTypes } = parse(schema);
      const input = simpleContentTypes[0].fields[0];

      const output = {
        label: 'Tags',
        apiId: 'tags',
        type: 'TEXT_SINGLELINE',
        hasMultipleValues: true,
      };

      expect(createFieldInput(input)).toEqual(output);
    });
  });

  describe('NonNullType', () => {
    it('throws an error', () => {
      const schema = `
        type Object implements SimpleContentType {
          mandatoryField: String!
        }
      `;
      const { simpleContentTypes } = parse(schema);
      const input = simpleContentTypes[0].fields[0];

      expect(() => createFieldInput(input)).toThrow({
        message: 'non-null fields are not supported',
        locations: [{ line: 3, column: 27 }],
      });
    });
  });

  it('converts the user type to an uppercased name', () => {
    const schema = `
      type FeaturedPost implements SimpleContentType {
        title: String
        comments: [FeaturedPostComment]
      }

      type FeaturedPostComment implements SimpleContentType {
        content: String
      }
    `;
    const { simpleContentTypes } = parse(schema);
    const input = simpleContentTypes[0].fields[1];

    const output = {
      label: 'Comments',
      apiId: 'comments',
      type: 'FEATURED_POST_COMMENT',
      hasMultipleValues: true,
    };

    expect(createFieldInput(input)).toEqual(output);
  });

  describe('Field with group name', () => {
    it('correctly parses the group name', () => {
      const schema = `
        type Object implements SimpleContentType {
          field: SinglelineText @config(groupName: "foo")
        }
      `;
      const { simpleContentTypes } = parse(schema);
      const input = simpleContentTypes[0].fields[0];

      const output = {
        label: 'Field',
        apiId: 'field',
        type: 'TEXT_SINGLELINE',
        hasMultipleValues: false,
        groupName: 'foo',
      };

      expect(createFieldInput(input)).toEqual(output);
    });

    it('throws an error if group name is empty', () => {
      const schema = `
        type Object implements SimpleContentType {
          twitter: SinglelineText @config(groupName: "")
        }
      `;
      const { simpleContentTypes } = parse(schema);
      const input = simpleContentTypes[0].fields[0];

      expect(() => createFieldInput(input)).toThrow({
        message: 'group name can not be empty',
        locations: [{ line: 3, column: 54 }],
      });
    });
  });

  describe('Field with reserved name', () => {
    it('throws an error', () => {
      const schema = `
        type Object implements SimpleContentType {
          id: SinglelineText
        }
      `;
      const { simpleContentTypes } = parse(schema);
      const input = simpleContentTypes[0].fields[0];

      expect(() => createFieldInput(input)).toThrow({
        message: 'id is a reserved field name',
        locations: [{ line: 3, column: 11 }],
      });
    });
  });

  describe('Field marked as title', () => {
    it('should set the includeInDisplayName parameter', () => {
      const schema = `
        type Object implements SimpleContentType {
          myTitle: SinglelineText @config(isTitle: true)
        }
      `;
      const { simpleContentTypes } = parse(schema);
      const input = simpleContentTypes[0].fields[0];

      const output = {
        label: 'My title',
        apiId: 'myTitle',
        type: 'TEXT_SINGLELINE',
        hasMultipleValues: false,
        includeInDisplayName: true,
      };

      expect(createFieldInput(input)).toEqual(output);
    });

    it('should throw an error if not boolean', () => {
      const schema = `
        type Object implements SimpleContentType {
          myTitle: SinglelineText @config(isTitle: "true")
        }
      `;
      const { simpleContentTypes } = parse(schema);
      const input = simpleContentTypes[0].fields[0];

      expect(() => createFieldInput(input)).toThrow({
        message: 'was expecting Boolean',
        locations: [{ line: 3, column: 52 }],
      });
    });

    it('should throw an error if set on a wrong field type', () => {
      const schema = `
        type Object implements SimpleContentType {
          myTitle: MultilineText @config(isTitle: true)
        }
      `;
      const { simpleContentTypes } = parse(schema);
      const input = simpleContentTypes[0].fields[0];

      expect(() => createFieldInput(input)).toThrow({
        message:
          'isTitle flag is only valid on String, ID, SinglelineText fields',
        locations: [{ line: 3, column: 20 }],
      });
    });
  });

  describe('Field with label', () => {
    it('should set the label parameter', () => {
      const schema = `
        type Object implements SimpleContentType {
          myField: SinglelineText @config(label: "My test field")
        }
      `;
      const { simpleContentTypes } = parse(schema);
      const input = simpleContentTypes[0].fields[0];

      const output = {
        label: 'My test field',
        apiId: 'myField',
        type: 'TEXT_SINGLELINE',
        hasMultipleValues: false,
      };

      expect(createFieldInput(input)).toEqual(output);
    });

    it('the first letter of the lable should be capitalised', () => {
      const schema = `
        type Object implements SimpleContentType {
          myField: SinglelineText @config(label: "my test field")
        }
      `;
      const { simpleContentTypes } = parse(schema);
      const input = simpleContentTypes[0].fields[0];

      const output = {
        label: 'My test field',
        apiId: 'myField',
        type: 'TEXT_SINGLELINE',
        hasMultipleValues: false,
      };

      expect(createFieldInput(input)).toEqual(output);
    });

    it('should throw an error if not string', () => {
      const schema = `
        type Object implements SimpleContentType {
          myField: SinglelineText @config(label: 42)
        }
      `;
      const { simpleContentTypes } = parse(schema);
      const input = simpleContentTypes[0].fields[0];

      expect(() => createFieldInput(input)).toThrow({
        message: 'was expecting String',
        locations: [{ line: 3, column: 50 }],
      });
    });
  });

  describe('Field without label', () => {
    it('should convert the api id correctly to a label', () => {
      const schema = `
        type Object implements SimpleContentType {
          myField: SinglelineText
          myCMSField: SinglelineText
          my_field: SinglelineText
          myField1: SinglelineText
        }
      `;
      const { simpleContentTypes } = parse(schema);
      const input = simpleContentTypes[0].fields;
      const output = [
        {
          label: 'My field',
          apiId: 'myField',
          type: 'TEXT_SINGLELINE',
          hasMultipleValues: false,
        },
        {
          label: 'My CMS field',
          apiId: 'myCMSField',
          type: 'TEXT_SINGLELINE',
          hasMultipleValues: false,
        },
        {
          label: 'My field',
          apiId: 'my_field',
          type: 'TEXT_SINGLELINE',
          hasMultipleValues: false,
        },
        {
          label: 'My field 1',
          apiId: 'myField1',
          type: 'TEXT_SINGLELINE',
          hasMultipleValues: false,
        },
      ];

      for (let i = 0; i < output.length; i++) {
        expect(createFieldInput(input[i])).toEqual(output[i]);
      }
    });
  });

  describe('Field with description', () => {
    it('should set the description parameter', () => {
      const schema = `
        type Object implements SimpleContentType {
          myField: SinglelineText @config(description: "My test field")
        }
      `;
      const { simpleContentTypes } = parse(schema);
      const input = simpleContentTypes[0].fields[0];

      const output = {
        label: 'My field',
        apiId: 'myField',
        type: 'TEXT_SINGLELINE',
        hasMultipleValues: false,
        description: 'My test field',
      };

      expect(createFieldInput(input)).toEqual(output);
    });

    it('should throw an error if not string', () => {
      const schema = `
        type Object implements SimpleContentType {
          myField: SinglelineText @config(description: 42)
        }
      `;
      const { simpleContentTypes } = parse(schema);
      const input = simpleContentTypes[0].fields[0];

      expect(() => createFieldInput(input)).toThrow({
        message: 'was expecting String',
        locations: [{ line: 3, column: 56 }],
      });
    });
  });
});
