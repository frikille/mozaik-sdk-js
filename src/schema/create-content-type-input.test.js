const createContentTypeInput = require('./create-content-type-input');
const parse = require('./parse.js');

describe('createContentTypeInput function', () => {
  describe('SimpleContentType', () => {
    it('returns the correct ContentTypeInput', () => {
      const schema = `
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
        fields: [
          {
            apiId: 'name',
            label: 'Name',
            type: 'TEXT_SINGLELINE',
            hasMultipleValues: false,
            position: 1,
          },
          {
            apiId: 'twitter',
            label: 'Twitter',
            type: 'TEXT_SINGLELINE',
            hasMultipleValues: false,
            position: 2,
          },
          {
            apiId: 'email',
            label: 'Email',
            type: 'TEXT_SINGLELINE',
            hasMultipleValues: false,
            position: 3,
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
  });

  describe('SingletonContentType', () => {
    it('returns the correct ContentTypeInput', () => {
      const schema = `
        type Homepage implements SingletonContentType {
          title: String
        }
      `;
      const { singletonContentTypes } = parse(schema);
      const input = singletonContentTypes[0];

      const output = {
        apiId: 'HOMEPAGE',
        name: 'Homepage',
        fields: [
          {
            apiId: 'title',
            label: 'Title',
            type: 'TEXT_SINGLELINE',
            hasMultipleValues: false,
            position: 1,
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
  });

  describe('EmbeddableContentType', () => {
    it('returns the correct ContentTypeInput', () => {
      const schema = `
        type Picture implements EmbeddableContentType {
          url: String
        }
      `;
      const { embeddableContentTypes } = parse(schema);
      const input = embeddableContentTypes[0];

      const output = {
        apiId: 'PICTURE',
        name: 'Picture',
        fields: [
          {
            apiId: 'url',
            label: 'Url',
            type: 'TEXT_SINGLELINE',
            hasMultipleValues: false,
            position: 1,
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
  });

  describe('EnumContentType', () => {
    it('returns the correct ContentTypeInput', () => {
      const schema = `
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
