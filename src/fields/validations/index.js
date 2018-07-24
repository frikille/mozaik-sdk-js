// @flow
const createValidationInput = require('./create/index.js');

import type { DateType as Date, DateTime } from '../index.js';
import type { FieldValidationInput } from './create/index.js';

export type FieldValidation = { id: string } & FieldValidationInput;

export type FieldValidationConfigInput = {
  lengthMin?: number,
  lengthMax?: number,
  valueMinInt?: number,
  valueMaxInt?: number,
  valueMinFloat?: number,
  valueMaxFloat?: number,
  dateMin?: Date,
  dateMax?: Date,
  dateTimeMin?: DateTime,
  dateTimeMax?: DateTime,
  pattern?: string,
  imageWidth?: number,
  imageHeight?: number,
  maxFileSize?: number,
  fileType?: string,
};

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

module.exports = {
  create: createValidationInput,
};
