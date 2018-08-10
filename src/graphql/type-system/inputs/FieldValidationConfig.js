// @flow
import type { DateType as Date } from '../scalars/DateScalar.js';
import type { DateTime } from '../scalars/DateTimeScalar.js';

const fieldValidationConfigInput = `
input FieldValidationConfigInput {
  lengthMin: Int
  lengthMax: Int
  valueMinInt: Int
  valueMaxInt: Int
  valueMinFloat: Float
  valueMaxFloat: Float
  dateMin: Date
  dateMax: Date
  dateTimeMin: DateTime
  dateTimeMax: DateTime
  pattern: String,
  imageWidth: Int
  imageHeight: Int
  maxFileSize: Float
  fileType: String
}`;

module.exports = fieldValidationConfigInput;

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
