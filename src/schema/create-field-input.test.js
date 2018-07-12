const createFieldInput = require('./create-field-input');
const extractContentTypes = require('./extract-content-types.js');

describe('createFieldInput function', () => {
  describe('NamedType', () => {
    it('returns the correct FieldInput object', () => {
      const schema = `
        type Object implements SimpleContentType {
          twitter: SinglelineText
        }
      `;
      const { simpleContentTypes } = extractContentTypes(schema);
      const input = simpleContentTypes[0].fields[0];

      const output = {
        label: 'twitter',
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
      const { simpleContentTypes } = extractContentTypes(schema);
      const input = simpleContentTypes[1].fields[0];

      const output = {
        label: 'post',
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
      const { simpleContentTypes } = extractContentTypes(schema);
      const input = simpleContentTypes[0].fields[0];

      const output = {
        label: 'tags',
        apiId: 'tags',
        type: 'TEXT_SINGLELINE',
        hasMultipleValues: true,
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
    const { simpleContentTypes } = extractContentTypes(schema);
    const input = simpleContentTypes[0].fields[1];

    const output = {
      label: 'comments',
      apiId: 'comments',
      type: 'FEATURED_POST_COMMENT',
      hasMultipleValues: true,
    };

    expect(createFieldInput(input)).toEqual(output);
  });

  describe('NonNullType', () => {
    it('throws an error', () => {
      const schema = `
        type Object implements SimpleContentType {
          mandatoryField: String!
        }
      `;
      const { simpleContentTypes } = extractContentTypes(schema);
      const input = simpleContentTypes[0].fields[0];

      expect(() => createFieldInput(input)).toThrow({
        message: 'non-null fields are not supported',
        locations: [{ line: 3, column: 27 }],
      });
    });
  });
});
