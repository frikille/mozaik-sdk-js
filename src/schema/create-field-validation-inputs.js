// @flow
const FieldValidationInput = require('../fields/validations/create/index.js');
import type { GraphQLInputType } from 'graphql';
import type { FieldDefinitionNode, DirectiveNode } from 'graphql/language/ast';
const getArgumentValue = require('./get-argument-value.js');
const getFieldType = require('./get-field-type.js');
const { GraphQLInt, GraphQLFloat, GraphQLString } = require('graphql');
import type { DateType, DateTime } from '../../index.js';

function createLengthValidation(
  field: FieldDefinitionNode,
  directive: DirectiveNode
): Array<FieldValidationInput> {
  const inputs: Array<FieldValidationInput> = [];

  const { arguments: args = [] } = directive;
  const min = getArgumentValue(args, 'minLength', GraphQLInt, () => {});
  const max = getArgumentValue(args, 'maxLength', GraphQLInt, v => {
    if (typeof min !== 'undefined' && parseInt(v) < parseInt(min)) {
      throw new Error('maxLength should be equal or greater than minLength');
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

  if (typeof min !== 'undefined' && typeof max !== 'undefined') {
    inputs.push({
      type: 'LENGTH_RANGE',
      config: { lengthMin: parseInt(min), lengthMax: parseInt(max) },
      errorMessage: errorMessage,
    });
  } else if (typeof min !== 'undefined') {
    inputs.push({
      type: 'MIN_LENGTH',
      config: { lengthMin: parseInt(min) },
      errorMessage: errorMessage,
    });
  } else {
    inputs.push({
      type: 'MAX_LENGTH',
      config: { lengthMax: parseInt(max) },
      errorMessage: errorMessage,
    });
  }

  return inputs;
}

function createMinMaxValidation(
  field: FieldDefinitionNode,
  directive: DirectiveNode,
  type: GraphQLInputType,
  configFields: Array<string>,
  value: mixed => mixed,
  isAGreaterThanB: (a: mixed, b: mixed) => boolean
): Array<FieldValidationInput> {
  const inputs: Array<FieldValidationInput> = [];

  const { arguments: args = [] } = directive;
  const min = getArgumentValue(args, 'min', type, v => {
    value(v);
  });
  const max = getArgumentValue(args, 'max', type, v => {
    value(v);
    if (typeof min !== 'undefined' && isAGreaterThanB(min, v)) {
      throw new Error('max should be equal or greater than min');
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
    config[configFields[0]] = value(min);
    config[configFields[1]] = value(max);
    inputs.push({ type: 'RANGE', config, errorMessage });
  } else if (typeof min !== 'undefined') {
    config[configFields[0]] = value(min);
    inputs.push({ type: 'MIN_VALUE', config, errorMessage });
  } else {
    config[configFields[1]] = value(max);
    inputs.push({ type: 'MAX_VALUE', config, errorMessage });
  }

  return inputs;
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

function createPatternValidation(
  field: FieldDefinitionNode,
  directive: DirectiveNode
): Array<FieldValidationInput> {
  const inputs: Array<FieldValidationInput> = [];

  const { arguments: args = [] } = directive;
  const pattern = getArgumentValue(args, 'pattern', GraphQLString, v => {
    if (String(v).trim() === '') {
      throw new Error('pattern should not be empty');
    }

    new RegExp(String(v)); // validate regexp
  });
  const errorMessage = getArgumentValue(
    args,
    'errorMessage',
    GraphQLString,
    () => {}
  );
  if (pattern) {
    inputs.push({
      type: 'PATTERN',
      config: { pattern: String(pattern) },
      errorMessage: errorMessage,
    });
  }
  return inputs;
}

// TODO: replace these with min/max validation when the API supports it
function createImageMaxWidthValidation(
  field: FieldDefinitionNode,
  directive: DirectiveNode
): Array<FieldValidationInput> {
  const inputs: Array<FieldValidationInput> = [];

  const { arguments: args = [] } = directive;
  const maxWidth = getArgumentValue(args, 'maxWidth', GraphQLInt, v => {
    if (parseInt(v) <= 0) {
      throw new Error('was expecting a positive integer');
    }
  });
  const errorMessage = getArgumentValue(
    args,
    'errorMessage',
    GraphQLString,
    () => {}
  );
  if (typeof maxWidth !== 'undefined') {
    inputs.push({
      type: 'IMAGE_WIDTH',
      config: { imageWidth: parseInt(maxWidth) },
      errorMessage: errorMessage,
    });
  }
  return inputs;
}

// TODO: replace these with min/max validation when the API supports it
function createImageMaxHeightValidation(
  field: FieldDefinitionNode,
  directive: DirectiveNode
): Array<FieldValidationInput> {
  const inputs: Array<FieldValidationInput> = [];

  const { arguments: args = [] } = directive;
  const maxHeight = getArgumentValue(args, 'maxHeight', GraphQLInt, v => {
    if (parseInt(v) <= 0) {
      throw new Error('was expecting a positive integer');
    }
  });
  const errorMessage = getArgumentValue(
    args,
    'errorMessage',
    GraphQLString,
    () => {}
  );
  if (typeof maxHeight !== 'undefined') {
    inputs.push({
      type: 'IMAGE_HEIGHT',
      config: { imageHeight: parseInt(maxHeight) },
      errorMessage: errorMessage,
    });
  }
  return inputs;
}

function createMaxSizeValidation(
  field: FieldDefinitionNode,
  directive: DirectiveNode
): Array<FieldValidationInput> {
  const inputs: Array<FieldValidationInput> = [];

  const { arguments: args = [] } = directive;
  const maxSize = getArgumentValue(args, 'maxSize', GraphQLInt, v => {
    if (parseInt(v) <= 0) {
      throw new Error('was expecting a positive integer');
    }
  });
  const errorMessage = getArgumentValue(
    args,
    'errorMessage',
    GraphQLString,
    () => {}
  );
  if (typeof maxSize !== 'undefined') {
    inputs.push({
      type: 'MAX_FILE_SIZE',
      config: { maxFileSize: parseInt(maxSize) },
      errorMessage: errorMessage,
    });
  }
  return inputs;
}

function createFileTypeValidation(
  field: FieldDefinitionNode,
  directive: DirectiveNode
): Array<FieldValidationInput> {
  const inputs: Array<FieldValidationInput> = [];

  const { arguments: args = [] } = directive;
  const fileType = getArgumentValue(args, 'fileType', GraphQLString, v => {
    if (v === '') {
      throw new Error('file type can not be empty');
    }
  });
  const errorMessage = getArgumentValue(
    args,
    'errorMessage',
    GraphQLString,
    () => {}
  );
  if (fileType) {
    inputs.push({
      type: 'FILE_TYPE',
      config: { fileType: String(fileType) },
      errorMessage: errorMessage,
    });
  }
  return inputs;
}

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
          inputs.push(...createLengthValidation(field, directive));
          inputs.push(...createPatternValidation(field, directive));
          break;
        case 'Int':
          inputs.push(
            ...createMinMaxValidation(
              field,
              directive,
              GraphQLInt,
              ['valueMinInt', 'valueMaxInt'],
              v => parseInt(v),
              (a, b) => parseInt(a) > parseInt(b)
            )
          );
          break;
        case 'Float':
          inputs.push(
            ...createMinMaxValidation(
              field,
              directive,
              GraphQLFloat,
              ['valueMinFloat', 'valueMaxFloat'],
              v => parseFloat(v),
              (a, b) => parseFloat(a) > parseFloat(b)
            )
          );
          break;
        case 'Date':
          inputs.push(
            ...createMinMaxValidation(
              field,
              directive,
              GraphQLString,
              ['dateMin', 'dateMax'],
              v => parseDate(String(v)),
              (a, b) => {
                const ad = new Date(String(a));
                const bd = new Date(String(b));
                return ad.getTime() > bd.getTime();
              }
            )
          );
          break;
        case 'DateTime':
          inputs.push(
            ...createMinMaxValidation(
              field,
              directive,
              GraphQLString,
              ['dateTimeMin', 'dateTimeMax'],
              v => parseDateTime(String(v)),
              (a, b) => {
                const ad = new Date(String(a));
                const bd = new Date(String(b));
                return ad.getTime() > bd.getTime();
              }
            )
          );
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
