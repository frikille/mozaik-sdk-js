const createFieldInput = require('./create-field-input');

describe('createFieldInput function', () => {
  describe('NamedType', () => {
    it('returns the correct FieldInput object', () => {
      const input = {
        kind: 'FieldDefinition',
        name: {
          kind: 'Name',
          value: 'twitter',
        },
        type: {
          kind: 'NamedType',
          name: {
            kind: 'Name',
            value: 'SinglelineText',
          },
        },
        arguments: [],
        directives: [],
      };

      const output = {
        label: 'twitter',
        apiId: 'twitter',
        type: 'TEXT_SINGLELINE',
        hasMultipleValues: false,
      };

      expect(createFieldInput(input)).toEqual(output);
    });

    it('throws an error for an unknown type', () => {
      const input = {
        kind: 'FieldDefinition',
        name: {
          kind: 'Name',
          value: 'twitter',
        },
        type: {
          kind: 'NamedType',
          name: {
            kind: 'Name',
            value: 'UnknownType',
          },
        },
        arguments: [],
        directives: [],
      };
      expect(() => createFieldInput(input)).toThrowError(
        'missing GraphQL type mapping for UnknownType'
      );
    });
  });

  describe('ListType', () => {
    it('returns the correct FieldInput object', () => {
      const input = {
        kind: 'FieldDefinition',
        name: {
          kind: 'Name',
          value: 'tags',
        },
        arguments: [],
        type: {
          kind: 'ListType',
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'SinglelineText',
            },
          },
        },
        directives: [],
      };

      const output = {
        label: 'tags',
        apiId: 'tags',
        type: 'TEXT_SINGLELINE',
        hasMultipleValues: true,
      };

      expect(createFieldInput(input)).toEqual(output);
    });
  });
  describe('NonNullType', () => {
    it('throws an error', () => {
      const input = {
        kind: 'FieldDefinition',
        name: {
          kind: 'Name',
          value: 'twitter',
        },
        type: {
          kind: 'NonNullType',
          type: {
            name: {
              kind: 'Name',
              value: 'SinglelineText',
            },
          },
        },
        arguments: [],
        directives: [],
      };
      expect(() => createFieldInput(input)).toThrowError(
        'non-null type fields are not supported'
      );
    });
  });
});
