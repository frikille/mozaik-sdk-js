const extractContentTypes = require('./extract-content-types.js');

describe('the extractContentTypes method', () => {
  it('parses the schema correctly', () => {
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
  });
});
