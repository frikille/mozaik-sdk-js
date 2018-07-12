const extractContentTypes = require('./extract-content-types.js');
const createContentTypeInput = require('./create-content-type-input');

describe('the extractContentTypes method', () => {
  it('parses the schema correctly and all content types can be processed', () => {
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
      embeddableContentTypes,
      hashmapContentTypes,
    } = extractContentTypes(schema);

    expect(simpleContentTypes).toHaveLength(3);

    simpleContentTypes.forEach(ct => {
      createContentTypeInput(ct);
    });

    singletonContentTypes.forEach(ct => {
      createContentTypeInput(ct);
    });

    embeddableContentTypes.forEach(ct => {
      createContentTypeInput(ct);
    });

    hashmapContentTypes.forEach(ct => {
      createContentTypeInput(ct);
    });
  });
});
