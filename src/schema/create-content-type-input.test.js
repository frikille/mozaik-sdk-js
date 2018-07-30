const createContentTypeInput = require('./create-content-type-input');
const parse = require('./parse.js');

describe('createContentTypeInput function', () => {
  describe('SimpleContentType', () => {
    it('returns the correct ContentTypeInput', () => {
      const schema = `
        "Test description"
        type Author implements SimpleContentType {
          name: SinglelineText
          twitter: SinglelineText
          email: SinglelineText
        }
      `;
      const { simpleContentTypes } = parse(schema);
      const input = simpleContentTypes[0];

      const output = {
        apiId: 'AUTHOR',
        name: 'Author',
        description: 'Test description',
        fields: [
          {
            apiId: 'name',
            label: 'Name',
            description: '',
            type: 'TEXT_SINGLELINE',
            hasMultipleValues: false,
            position: 1,
            validations: [],
          },
          {
            apiId: 'twitter',
            label: 'Twitter',
            description: '',
            type: 'TEXT_SINGLELINE',
            hasMultipleValues: false,
            position: 2,
            validations: [],
          },
          {
            apiId: 'email',
            label: 'Email',
            description: '',
            type: 'TEXT_SINGLELINE',
            hasMultipleValues: false,
            position: 3,
            validations: [],
          },
        ],
      };

      expect(createContentTypeInput(input)).toEqual(output);
    });

    it('uses underscore for multipart camel case names', () => {
      const schema = `
        type CamelCaseName implements SimpleContentType {
          field1: String
        }
        `;
      const { simpleContentTypes } = parse(schema);
      const input = simpleContentTypes[0];

      expect(createContentTypeInput(input).apiId).toEqual('CAMEL_CASE_NAME');
    });

    it('generates a label from the name', () => {
      const schema = `
        type CamelCaseName implements SimpleContentType {
          field1: String
        }
        `;
      const { simpleContentTypes } = parse(schema);
      const input = simpleContentTypes[0];

      expect(createContentTypeInput(input).name).toEqual('Camel case name');
    });
  });

  describe('SingletonContentType', () => {
    it('returns the correct ContentTypeInput', () => {
      const schema = `
        "Test description"
        type Homepage implements SingletonContentType {
          title: String
        }
      `;
      const { singletonContentTypes } = parse(schema);
      const input = singletonContentTypes[0];

      const output = {
        apiId: 'HOMEPAGE',
        name: 'Homepage',
        description: 'Test description',
        fields: [
          {
            apiId: 'title',
            label: 'Title',
            description: '',
            type: 'TEXT_SINGLELINE',
            hasMultipleValues: false,
            position: 1,
            validations: [],
          },
        ],
        isLandingPage: true,
      };

      expect(createContentTypeInput(input)).toEqual(output);
    });

    it('uses underscore for multipart camel case names', () => {
      const schema = `
          type CamelCaseName implements SingletonContentType {
            field1: String
          }
        `;
      const { singletonContentTypes } = parse(schema);
      const input = singletonContentTypes[0];

      expect(createContentTypeInput(input).apiId).toEqual('CAMEL_CASE_NAME');
    });

    it('generates a label from the name', () => {
      const schema = `
        type CamelCaseName implements SingletonContentType {
          field1: String
        }
        `;
      const { singletonContentTypes } = parse(schema);
      const input = singletonContentTypes[0];

      expect(createContentTypeInput(input).name).toEqual('Camel case name');
    });
  });

  describe('EmbeddableContentType', () => {
    it('returns the correct ContentTypeInput', () => {
      const schema = `
        "Test description"
        type Picture implements EmbeddableContentType {
          url: String
        }
      `;
      const { embeddableContentTypes } = parse(schema);
      const input = embeddableContentTypes[0];

      const output = {
        apiId: 'PICTURE',
        name: 'Picture',
        description: 'Test description',
        fields: [
          {
            apiId: 'url',
            label: 'Url',
            description: '',
            type: 'TEXT_SINGLELINE',
            hasMultipleValues: false,
            position: 1,
            validations: [],
          },
        ],
        isBlockGroup: true,
      };

      expect(createContentTypeInput(input)).toEqual(output);
    });

    it('uses underscore for multipart camel case names', () => {
      const schema = `
          type CamelCaseName implements EmbeddableContentType {
            field1: String
          }
        `;
      const { embeddableContentTypes } = parse(schema);
      const input = embeddableContentTypes[0];

      expect(createContentTypeInput(input).apiId).toEqual('CAMEL_CASE_NAME');
    });

    it('generates a label from the name', () => {
      const schema = `
        type CamelCaseName implements EmbeddableContentType {
          field1: String
        }
        `;
      const { embeddableContentTypes } = parse(schema);
      const input = embeddableContentTypes[0];

      expect(createContentTypeInput(input).name).toEqual('Camel case name');
    });
  });

  describe('EnumContentType', () => {
    it('returns the correct ContentTypeInput', () => {
      const schema = `
        "Test description"
        enum Color {
          blue @config(label: "Blue")
          lightRed @config(label: "Light red")
        }
      `;
      const { hashmapContentTypes } = parse(schema);
      const input = hashmapContentTypes[0];

      const output = {
        apiId: 'COLOR',
        name: 'Color',
        description: 'Test description',
        enumValues: [
          {
            key: 'blue',
            value: 'Blue',
          },
          {
            key: 'lightRed',
            value: 'Light red',
          },
        ],
        isEnum: true,
        isHashmap: true,
      };

      expect(createContentTypeInput(input)).toEqual(output);
    });

    it('uses underscore for multipart camel case names', () => {
      const schema = `
        enum CamelCaseName {
          value1 @config(label: "Value 1")
        }
      `;
      const { hashmapContentTypes } = parse(schema);
      const input = hashmapContentTypes[0];

      expect(createContentTypeInput(input).apiId).toEqual('CAMEL_CASE_NAME');
    });

    it('generates a label from the name', () => {
      const schema = `
        enum CamelCaseName {
          value1 @config(label: "Value 1")
        }
        `;
      const { hashmapContentTypes } = parse(schema);
      const input = hashmapContentTypes[0];

      expect(createContentTypeInput(input).name).toEqual('Camel case name');
    });

    it('uses enum key as value if @config is not set', () => {
      const schema = `
        enum Color {
          blue
        }
      `;
      const { hashmapContentTypes } = parse(schema);
      const input = hashmapContentTypes[0];

      const output = {
        apiId: 'COLOR',
        name: 'Color',
        description: '',
        enumValues: [
          {
            key: 'blue',
            value: 'blue',
          },
        ],
        isEnum: true,
        isHashmap: true,
      };

      expect(createContentTypeInput(input)).toEqual(output);
    });

    it('uses enum key as value if label is not set under @config', () => {
      const schema = `
        enum Color {
          blue @config
        }
      `;
      const { hashmapContentTypes } = parse(schema);
      const input = hashmapContentTypes[0];

      const output = {
        apiId: 'COLOR',
        name: 'Color',
        description: '',
        enumValues: [
          {
            key: 'blue',
            value: 'blue',
          },
        ],
        isEnum: true,
        isHashmap: true,
      };

      expect(createContentTypeInput(input)).toEqual(output);
    });

    it('throws an error if label is empty', () => {
      const schema = `
        enum Color {
          blue @config(label: "")
        }
      `;
      const { hashmapContentTypes } = parse(schema);
      const input = hashmapContentTypes[0];
      expect(() => createContentTypeInput(input)).toThrow({
        message: 'label can not be empty',
        locations: [{ line: 3, column: 31 }],
      });
    });

    it('throws an error if label is not a string', () => {
      const schema = `
        enum Color {
          blue @config(label: 123)
        }
      `;
      const { hashmapContentTypes } = parse(schema);
      const input = hashmapContentTypes[0];
      expect(() => createContentTypeInput(input)).toThrow({
        message: 'was expecting String',
        locations: [{ line: 3, column: 31 }],
      });
    });
  });
});
