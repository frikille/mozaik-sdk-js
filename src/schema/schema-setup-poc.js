/* eslint no-unused-vars: 0, no-undef: 0 */
const createContentTypeInput = require('./create-content-type-input.js');
const extractContentTypes = require('./extract-content-types.js');

const schema = `
  type Author implements SimpleContentType {
    name: SinglelineText
    twitter: SinglelineText
    email: SinglelineText
  }

  type Category implements SimpleContentType {
    name: String
    subcategories: [Category]
  }

  type Post implements SimpleContentType {
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

const {
  simpleContentTypes,
  singletonContentTypes,
  embaddableContentTypes,
  hashmapContentTypes,
} = extractContentTypes(schema);

const contentTypesToCreate = [
  ...simpleContentTypes.map(c => createContentTypeInput(c)),
  ...singletonContentTypes.map(c => createContentTypeInput(c)),
  ...embaddableContentTypes.map(c => createContentTypeInput(c)),
  ...hashmapContentTypes.map(c => createContentTypeInput(c)),
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
