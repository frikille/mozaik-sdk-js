// @flow
const FieldValidationInput = require('../fields/validations/create/index.js');
import type { GraphQLInputType } from 'graphql';
import type { FieldDefinitionNode, DirectiveNode } from 'graphql/language/ast';
const getArgumentValue = require('./get-argument-value.js');
const getFieldType = require('./get-field-type.js');
const { GraphQLInt, GraphQLFloat, GraphQLString } = require('graphql');
import type { DateType, DateTime } from '../../index.js';

function createValidationFunc(
  argName: string,
  argType: GraphQLInputType,
  validationType: string,
  configKey: string,
  value: mixed => mixed,
  validator: mixed => void
): (
  field: FieldDefinitionNode,
  directive: DirectiveNode
) => Array<FieldValidationInput> {
  return function(field: FieldDefinitionNode, directive: DirectiveNode) {
    const inputs: Array<FieldValidationInput> = [];

    const { arguments: args = [] } = directive;
    const argValue = getArgumentValue(args, argName, argType, validator);
    const errorMessage = getArgumentValue(
      args,
      'errorMessage',
      GraphQLString,
      () => {}
    );
    if (typeof argValue !== 'undefined') {
      const config = {};
      config[configKey] = value(argValue);
      inputs.push({ type: validationType, config, errorMessage });
    }
    return inputs;
  };
}

function createMinMaxValidationFunc(
  argNames: Array<string>,
  argType: GraphQLInputType,
  validationTypes: Array<string>,
  configKeys: Array<string>,
  value: mixed => mixed,
  isAGreaterThanB: (a: mixed, b: mixed) => boolean
): (
  field: FieldDefinitionNode,
  directive: DirectiveNode
) => Array<FieldValidationInput> {
  return function(field: FieldDefinitionNode, directive: DirectiveNode) {
    const inputs: Array<FieldValidationInput> = [];

    const { arguments: args = [] } = directive;
    const min = getArgumentValue(args, argNames[0], argType, v => {
      value(v);
    });
    const max = getArgumentValue(args, argNames[1], argType, v => {
      value(v);
      if (typeof min !== 'undefined' && isAGreaterThanB(min, v)) {
        throw new Error(
          `${argNames[1]} should be equal or greater than ${argNames[0]}`
        );
      }
    });
    const errorMessage = getArgumentValue(
      args,
      'errorMessage',
      GraphQLString,
      () => {}
    );

    if (typeof min === 'undefined' && typeof max === 'undefined') {
      return [];
    }

    const config = {};
    if (typeof min !== 'undefined' && typeof max !== 'undefined') {
      config[configKeys[0]] = value(min);
      config[configKeys[1]] = value(max);
      inputs.push({ type: validationTypes[2], config, errorMessage });
    } else if (typeof min !== 'undefined') {
      config[configKeys[0]] = value(min);
      inputs.push({ type: validationTypes[0], config, errorMessage });
    } else {
      config[configKeys[1]] = value(max);
      inputs.push({ type: validationTypes[1], config, errorMessage });
    }

    return inputs;
  };
}

function parseDate(value: string): DateType {
  const date = new Date(value);
  if (isNaN(date.getTime())) {
    throw new Error('invalid date');
  }

  const dateString = date.toJSON();
  if (value !== dateString.substring(0, dateString.indexOf('T'))) {
    throw new Error('invalid date format, only accepts: YYYY-MM-DD');
  }
  return value;
}

function parseDateTime(value: string): DateTime {
  const date = new Date(value);
  if (isNaN(date.getTime())) {
    throw new Error('invalid date');
  }
  if (value !== date.toJSON()) {
    throw new Error(
      'Invalid datetime format, only accepts: YYYY-MM-DDTHH:MM:SS.SSSZ'
    );
  }
  return value;
}

const createPatternValidation = createValidationFunc(
  'pattern',
  GraphQLString,
  'PATTERN',
  'pattern',
  v => String(v),
  v => {
    if (String(v).trim() === '') {
      throw new Error('pattern should not be empty');
    }
    new RegExp(String(v)); // validate regexp
  }
);

const createImageMaxWidthValidation = createValidationFunc(
  'maxWidth',
  GraphQLInt,
  'IMAGE_WIDTH',
  'imageWidth',
  v => parseInt(v),
  v => {
    if (parseInt(v) <= 0) {
      throw new Error('was expecting a positive integer');
    }
  }
);

const createImageMaxHeightValidation = createValidationFunc(
  'maxHeight',
  GraphQLInt,
  'IMAGE_HEIGHT',
  'imageHeight',
  v => parseInt(v),
  v => {
    if (parseInt(v) <= 0) {
      throw new Error('was expecting a positive integer');
    }
  }
);

const createMaxSizeValidation = createValidationFunc(
  'maxSize',
  GraphQLInt,
  'MAX_FILE_SIZE',
  'maxFileSize',
  v => parseInt(v),
  v => {
    if (parseInt(v) <= 0) {
      throw new Error('was expecting a positive integer');
    }
  }
);

const createFileTypeValidation = createValidationFunc(
  'fileType',
  GraphQLString,
  'FILE_TYPE',
  'fileType',
  v => String(v),
  v => {
    if (v === '') {
      throw new Error('file type can not be empty');
    }
  }
);

const createLengthMinMaxValidation = createMinMaxValidationFunc(
  ['minLength', 'maxLength'],
  GraphQLInt,
  ['MIN_LENGTH', 'MAX_LENGTH', 'LENGTH_RANGE'],
  ['lengthMin', 'lengthMax'],
  v => parseInt(v),
  (a, b) => parseInt(a) > parseInt(b)
);

const createIntMinMaxValidation = createMinMaxValidationFunc(
  ['min', 'max'],
  GraphQLInt,
  ['MIN_VALUE', 'MAX_VALUE', 'RANGE'],
  ['valueMinInt', 'valueMaxInt'],
  v => parseInt(v),
  (a, b) => parseInt(a) > parseInt(b)
);

const createFloatMinMaxValidation = createMinMaxValidationFunc(
  ['min', 'max'],
  GraphQLFloat,
  ['MIN_VALUE', 'MAX_VALUE', 'RANGE'],
  ['valueMinFloat', 'valueMaxFloat'],
  v => parseFloat(v),
  (a, b) => parseFloat(a) > parseFloat(b)
);

const createDateMinMaxValidation = createMinMaxValidationFunc(
  ['min', 'max'],
  GraphQLString,
  ['MIN_VALUE', 'MAX_VALUE', 'RANGE'],
  ['dateMin', 'dateMax'],
  v => parseDate(String(v)),
  (a, b) => {
    const ad = new Date(String(a));
    const bd = new Date(String(b));
    return ad.getTime() > bd.getTime();
  }
);

const createDateTimeMinMaxValidation = createMinMaxValidationFunc(
  ['min', 'max'],
  GraphQLString,
  ['MIN_VALUE', 'MAX_VALUE', 'RANGE'],
  ['dateTimeMin', 'dateTimeMax'],
  v => parseDateTime(String(v)),
  (a, b) => {
    const ad = new Date(String(a));
    const bd = new Date(String(b));
    return ad.getTime() > bd.getTime();
  }
);

module.exports = function createFieldValidationInputs(
  field: FieldDefinitionNode
): Array<FieldValidationInput> {
  const inputs: Array<FieldValidationInput> = [];

  const { directives = [] } = field;
  const validationDirectives =
    directives.filter(d => d.name.value === 'validation') || [];

  for (let directive of validationDirectives) {
    const { type, hasMultipleValues } = getFieldType(field.type);
    if (!hasMultipleValues) {
      switch (type) {
        case 'String':
        case 'ID':
        case 'SinglelineText':
        case 'MultilineText':
        case 'RichText':
          inputs.push(...createLengthMinMaxValidation(field, directive));
          inputs.push(...createPatternValidation(field, directive));
          break;
        case 'Int':
          inputs.push(...createIntMinMaxValidation(field, directive));
          break;
        case 'Float':
          inputs.push(...createFloatMinMaxValidation(field, directive));
          break;
        case 'Date':
          inputs.push(...createDateMinMaxValidation(field, directive));
          break;
        case 'DateTime':
          inputs.push(...createDateTimeMinMaxValidation(field, directive));
          break;

        case 'Image':
          // TODO: replace these with min/max validation when the API supports it
          inputs.push(...createImageMaxWidthValidation(field, directive));
          inputs.push(...createImageMaxHeightValidation(field, directive));
        // falls through
        case 'File':
        case 'Audio':
        case 'Video':
          inputs.push(...createMaxSizeValidation(field, directive));
          inputs.push(...createFileTypeValidation(field, directive));
          break;
      }
    }
  }

  return inputs;
};
