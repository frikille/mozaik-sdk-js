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
directive @config(label: String!, groupName: String!, isTitle: Boolean) on FIELD_DEFINITION

directive @deprecated(
  reason: String = "No longer supported"
) on FIELD_DEFINITION | ENUM_VALUE

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

union MinMaxValue = Int | Float | String

directive @validation(
  minLength: Int,
  maxLength: Int,
  min: MinMaxValue,
  max: MinMaxValue,
  pattern: String,
  width: Int,
  height: Int,
  maxSize: Int,
  fileType: String,
  errorMessage: String
) on FIELD_DEFINITION
`;

module.exports = schema;
