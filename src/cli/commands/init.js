const fs = require('fs');
const fileExists = require('../../utils/file-exists.js');

const MOZAIK_SCHEMA_NAME = 'mozaik-schema.graphql';
const MOZAIK_CONFIG_NAME = '.mozaikrc';

const EMPTY_SCHEMA = `
# An example 
# type Author implements SimpleContentType {
#   name: SinglelineText @config(groupName: "personal", isTitle: true)
#   email: SinglelineText @config(groupName: "personal")
#   twitter: SinglelineText @config(groupName: "social")
# }

# type Category implements SimpleContentType {
#   name: String @config(isTitle: true)
#   subcategories: [Category]
# }

# type Post implements SimpleContentType {
#   title: String @config(isTitle: true)
#   body: RichText
#   postAuthor: Author
#   featuredImage: FeaturedImage
#   categories: [Category]
# }

# enum ColorEnum {
#   blue @config(label: "Blue")
#   lightRed @config(label: "Light red")
# }

# type FeaturedImage implements EmbeddableContentType {
#   url: String
#   title: String @config(isTitle: true)
#   background: ColorEnum
# }

# type Homepage implements SingletonContentType {
#   title: String @config(isTitle: true)
#   highlightedPost: [Post]
# }
`;

const EMPTY_CONFIG = `
[default]
api_endpoint = your-project-api-endpoint
api_access_key = your-project-api-access-key
`;

module.exports = function init(options) {
  if (!fileExists(options.schemaPath)) {
    fs.writeFileSync(MOZAIK_SCHEMA_NAME, EMPTY_SCHEMA);
  }

  if (!fileExists(options.configPath)) {
    fs.writeFileSync(MOZAIK_CONFIG_NAME, EMPTY_CONFIG);
  }

  console.log('Done!'); //eslint-disable-line
};
