const createFieldInput = require('./create-field-input');
const parse = require('./parse.js');

describe('createFieldInput function', () => {
  describe('NamedType', () => {
    it('returns the correct FieldInput object', () => {
      const schema = `
        type Object implements SimpleContentType {
          "Test description"
          twitter: SinglelineText
        }
      `;
      const { simpleContentTypes } = parse(schema);
      const input = simpleContentTypes[0].fields[0];

      const output = {
        label: 'Twitter',
        apiId: 'twitter',
        description: 'Test description',
        type: 'TEXT_SINGLELINE',
        hasMultipleValues: false,
        validations: [],
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
        description: '',
        type: 'FEATURED_POST',
        hasMultipleValues: false,
        validations: [],
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
        description: '',
        type: 'TEXT_SINGLELINE',
        hasMultipleValues: true,
        validations: [],
      };

      expect(createFieldInput(input)).toEqual(output);
    });
  });

  describe('NonNullType', () => {
    it('returns the correct FieldInput object', () => {
      const schema = `
        type Object implements SimpleContentType {
          twitter: SinglelineText!
        }
      `;
      const { simpleContentTypes } = parse(schema);
      const input = simpleContentTypes[0].fields[0];

      const output = {
        label: 'Twitter',
        apiId: 'twitter',
        description: '',
        type: 'TEXT_SINGLELINE',
        hasMultipleValues: false,
        validations: [
          {
            config: {},
            errorMessage: 'this field is required',
            type: 'REQUIRED',
          },
        ],
      };

      expect(createFieldInput(input)).toEqual(output);
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
      description: '',
      type: 'FEATURED_POST_COMMENT',
      hasMultipleValues: true,
      validations: [],
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
        description: '',
        type: 'TEXT_SINGLELINE',
        hasMultipleValues: false,
        groupName: 'foo',
        validations: [],
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
        description: '',
        type: 'TEXT_SINGLELINE',
        hasMultipleValues: false,
        includeInDisplayName: true,
        validations: [],
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
        description: '',
        type: 'TEXT_SINGLELINE',
        hasMultipleValues: false,
        validations: [],
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
        description: '',
        type: 'TEXT_SINGLELINE',
        hasMultipleValues: false,
        validations: [],
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
          description: '',
          type: 'TEXT_SINGLELINE',
          hasMultipleValues: false,
          validations: [],
        },
        {
          label: 'My CMS field',
          apiId: 'myCMSField',
          description: '',
          type: 'TEXT_SINGLELINE',
          hasMultipleValues: false,
          validations: [],
        },
        {
          label: 'My field',
          apiId: 'my_field',
          description: '',
          type: 'TEXT_SINGLELINE',
          hasMultipleValues: false,
          validations: [],
        },
        {
          label: 'My field 1',
          apiId: 'myField1',
          description: '',
          type: 'TEXT_SINGLELINE',
          hasMultipleValues: false,
          validations: [],
        },
      ];

      for (let i = 0; i < output.length; i++) {
        expect(createFieldInput(input[i])).toEqual(output[i]);
      }
    });
  });

  describe('Field with validation', () => {
    it('correctly parses the validation configs', () => {
      const schema = `
        type Object implements SimpleContentType {
          field: SinglelineText @validation(minLength: 5, errorMessage: "err")
        }
      `;
      const { simpleContentTypes } = parse(schema);
      const input = simpleContentTypes[0].fields[0];

      const output = {
        label: 'Field',
        apiId: 'field',
        description: '',
        type: 'TEXT_SINGLELINE',
        hasMultipleValues: false,
        validations: [
          { config: { lengthMin: 5 }, errorMessage: 'err', type: 'MIN_LENGTH' },
        ],
      };

      expect(createFieldInput(input)).toEqual(output);
    });
  });

  describe('Field with multi-line descriptions', () => {
    it('removes the indentation from the description', () => {
      const schema = `
        type Object implements SimpleContentType {
          """
          This is a multiline
          description
          """
          field: SinglelineText
        }
      `;
      const { simpleContentTypes } = parse(schema);
      const input = simpleContentTypes[0].fields[0];

      expect(createFieldInput(input)['description']).toEqual(
        'This is a multiline\ndescription'
      );
    });
  });
});
