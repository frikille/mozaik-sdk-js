const schema = `
scalar SinglelineText
scalar MultilineText
scalar RichText
scalar Date
scalar DateTime
scalar Audio
scalar File
scalar Image
scalar Video

directive @config(label: String!) on ENUM_VALUE
directive @config(label: String!, description: String, groupName: String!, isTitle: Boolean) on FIELD_DEFINITION

interface SimpleContentType {
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

union MinMaxValue = Int | Float | String

directive @validation(
  minLength: Int,
  maxLength: Int,
  min: MinMaxValue,
  max: MinMaxValue,
  pattern: String,
  minWidth: Int,
  maxWidth: Int,
  minHeight: Int,
  maxHeight: Int,
  maxSize: Int,
  fileType: String,
  errorMessage: String
) on FIELD_DEFINITION
`;

module.exports = schema;
