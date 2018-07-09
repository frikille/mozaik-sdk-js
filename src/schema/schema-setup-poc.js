const graphql = require('graphql');
const { parse, buildASTSchema } = graphql;
const fs = require('fs');
const path = require('path');
const createContentTypeInput = require('./create-content-type-input.js');

const schema = `
scalar SingleLineText
scalar MultilineText
scalar RichText
scalar Date
scalar DateTime

directive @config(label: String!) on ENUM_VALUE

directive @position(position: Int!) on FIELD_VALUE
directive @groupName(name: String!) on FIELD_VALUE
directive @validation(validations: [Validation]) on FIELD_VALUE

interface SimpleContenType {
  id: String
  displayName: String
  slug: String
}

interface SingletonContentType {
  id: String
}

interface EmbeddableContentType {
  id: String
}

interface HashmapContentType {
  id: String
}
`;

const userSchema = `
  type Author implements SimpleContenType {
    name: SingleLineText
    twitter: SingleLineText
    email: SingleLineText
  }

  type Category implements SimpleContenType {
    name: String
    subcategories: [Category]
  }

  type Post implements SimpleContenType {
    title: String
    body: RichText
    author: Author
    featuredImage: FeaturedImage
    categories: [Category]
  }

  enum ColorEnum {
    blue @config(label: "Blue")
    lightRed @config(label: "Light red")
  }

  type FeaturedImage implements EmbeddableContentType {
    url: String
    title: String
    background: ColorEnum
  }

  type Homepage implements SingletonContentType {
    title: String
    highlightedPost: [Post]
  }
`;

const fullSchema = `${schema}\n${userSchema}`;

const parsedSchema = parse(fullSchema);
const ast = buildASTSchema(parsedSchema);

const { _typeMap, _implementations } = ast;

const typesByName = {};
const hashmapContentTypes = [];

parsedSchema.definitions.forEach(definition => {
  typesByName[definition.name.value] = definition;
  if (definition.kind === 'EnumTypeDefinition') {
    hashmapContentTypes.push(definition);
  }
});

const simpleContentTypes = (_implementations.SimpleContenType || []).map(
  name => typesByName[name]
);
const singletonContentTypes = (_implementations.SingletonContentType || []).map(
  name => typesByName[name]
);
const embeddableContentTypes = (
  _implementations.EmbeddableContentType || []
).map(name => typesByName[name]);

const contentTypesToCreate = [
  ...simpleContentTypes.map(c => createContentTypeInput(c)),
  ...singletonContentTypes.map(c => createContentTypeInput(c)),
  ...embaddableContentTypes.map(c => createContentTypeInput(c)),
  ...hasmapContentTypes.map(c => createContentTypeInput(c)),
];

// So hashmapContentTypes, simpleContentTypes, singletonContentTypes, embeddableContentTypes arrays
// contain the content types to be created

// It's trivial how to create the json input for the ContentTypeInput and FieldInput
// Must add validations for restricted field names (createdAt, content, etc)

// Show plan before creating the schema
// Only show the user content type schema SDL when applying changes for the first time
// Store the results locally
// Must be able to generate the same Schema SDL from JSON object: MozaikSDL <=> JSON representation

// How to find changes between 2 different schemas? And what to display?
