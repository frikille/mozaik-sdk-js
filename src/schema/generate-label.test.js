const generateLabel = require('./generate-label.js');

describe('generateLabel function', () => {
  it('should capitalise the first letter', () => {
    expect(generateLabel('my field label')).toEqual('My field label');
  });

  it('should replace underscores with spaces', () => {
    expect(generateLabel('my_field_label')).toEqual('My field label');
  });

  it('should add a space before a word', () => {
    expect(generateLabel('myFieldLabel')).toEqual('My field label');
  });

  it('should add a space before a number', () => {
    expect(generateLabel('myFieldLabel123')).toEqual('My field label 123');
  });

  it('should keep abbreviations', () => {
    expect(generateLabel('myCMSFieldLabel')).toEqual('My CMS field label');
  });
});
