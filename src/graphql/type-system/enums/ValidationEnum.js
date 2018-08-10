// @flow

const validationEnum = `
enum ValidationEnum {
  # Minimum length validation type
  MIN_LENGTH
  # Maximum length validation type
  MAX_LENGTH
  # Length range validation type
  LENGTH_RANGE
  # Required validation type
  REQUIRED
  # Regular expression pattern validation type
  PATTERN
  # Maximum file size validation type
  MAX_FILE_SIZE
  # File type validation type
  FILE_TYPE
  # Image width validation type
  IMAGE_WIDTH
  # Image height validation type
  IMAGE_HEIGHT
  # Image width and height validation type
  IMAGE_DIMENSION
  # Minimum value validation type
  MIN_VALUE
  # Maximum value validation type
  MAX_VALUE
  # Value range validation type
  VALUE_RANGE
}`;

module.exports = () => [validationEnum];

export type ValidationEnum =
  | 'MIN_LENGTH'
  | 'MAX_LENGTH'
  | 'LENGTH_RANGE'
  | 'REQUIRED'
  | 'PATTERN'
  | 'MAX_FILE_SIZE'
  | 'FILE_TYPE'
  | 'IMAGE_WIDTH'
  | 'IMAGE_HEIGHT'
  | 'IMAGE_DIMENSION'
  | 'MIN_VALUE'
  | 'MAX_VALUE'
  | 'VALUE_RANGE';
