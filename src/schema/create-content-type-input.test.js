const createContentTypeInput = require('./create-content-type-input');

const input = {
  kind: 'ObjectTypeDefinition',
  name: {
    kind: 'Name',
    value: 'Author',
    loc: {
      start: 544,
      end: 550,
    },
  },
  interfaces: [
    {
      kind: 'NamedType',
      name: {
        kind: 'Name',
        value: 'SimpleContentType',
        loc: {
          start: 562,
          end: 578,
        },
      },
      loc: {
        start: 562,
        end: 578,
      },
    },
  ],
  directives: [],
  fields: [
    {
      kind: 'FieldDefinition',
      name: {
        kind: 'Name',
        value: 'name',
        loc: {
          start: 585,
          end: 589,
        },
      },
      arguments: [],
      type: {
        kind: 'NamedType',
        name: {
          kind: 'Name',
          value: 'SinglelineText',
          loc: {
            start: 591,
            end: 605,
          },
        },
        loc: {
          start: 591,
          end: 605,
        },
      },
      directives: [],
      loc: {
        start: 585,
        end: 605,
      },
    },
    {
      kind: 'FieldDefinition',
      name: {
        kind: 'Name',
        value: 'twitter',
        loc: {
          start: 610,
          end: 617,
        },
      },
      arguments: [],
      type: {
        kind: 'NamedType',
        name: {
          kind: 'Name',
          value: 'SinglelineText',
          loc: {
            start: 619,
            end: 633,
          },
        },
        loc: {
          start: 619,
          end: 633,
        },
      },
      directives: [],
      loc: {
        start: 610,
        end: 633,
      },
    },
    {
      kind: 'FieldDefinition',
      name: {
        kind: 'Name',
        value: 'email',
        loc: {
          start: 638,
          end: 643,
        },
      },
      arguments: [],
      type: {
        kind: 'NamedType',
        name: {
          kind: 'Name',
          value: 'SinglelineText',
          loc: {
            start: 645,
            end: 659,
          },
        },
        loc: {
          start: 645,
          end: 659,
        },
      },
      directives: [],
      loc: {
        start: 638,
        end: 659,
      },
    },
  ],
  loc: {
    start: 539,
    end: 663,
  },
};

const output = {
  apiId: 'AUTHOR',
  name: 'Author',
  fields: [
    {
      apiId: 'name',
      label: 'name',
      type: 'TEXT_SINGLELINE',
      hasMultipleValues: false,
    },
    {
      apiId: 'twitter',
      label: 'twitter',
      type: 'TEXT_SINGLELINE',
      hasMultipleValues: false,
    },
    {
      apiId: 'email',
      label: 'email',
      type: 'TEXT_SINGLELINE',
      hasMultipleValues: false,
    },
  ],
};
describe('createContentTypeInput function', () => {
  it('returns the correct ContentTypeInput object for SimpleContentType', () => {
    expect(createContentTypeInput(input)).toEqual(output);
  });

  it('uses underscore for multipart camel case names', () => {
    const input = {
      kind: 'ObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'FeaturedImageThumbnail',
      },
      interfaces: [
        {
          kind: 'NamedType',
          name: {
            kind: 'Name',
            value: 'SimpleContentType',
          },
        },
      ],
      fields: [],
    };

    const output = {
      apiId: 'FEATURED_IMAGE_THUMBNAIL',
      name: 'FeaturedImageThumbnail',
      fields: [],
    };

    expect(createContentTypeInput(input)).toEqual(output);
  });
});
