const parse = require('./parse.js');
const createContentTypeInput = require('./create-content-type-input');

describe('the parse method', () => {
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
        postAuthor: Author
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
    } = parse(schema);

    expect(simpleContentTypes.length).toBeGreaterThan(0);
    simpleContentTypes.forEach(ct => {
      createContentTypeInput(ct);
    });

    expect(singletonContentTypes.length).toBeGreaterThan(0);
    singletonContentTypes.forEach(ct => {
      createContentTypeInput(ct);
    });

    expect(embeddableContentTypes.length).toBeGreaterThan(0);
    embeddableContentTypes.forEach(ct => {
      createContentTypeInput(ct);
    });

    expect(hashmapContentTypes.length).toBeGreaterThan(0);
    hashmapContentTypes.forEach(ct => {
      createContentTypeInput(ct);
    });
  });
});
