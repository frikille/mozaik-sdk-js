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

#directive @position(position: Int!) on FIELD_VALUE
#directive @groupName(name: String!) on FIELD_VALUE
#directive @validation(validations: [Validation]) on FIELD_VALUE

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
`;

module.exports = schema;