// @flow

import type { SchemaDiffResult } from '../graphql/type-system/types/SchemaDiffResult.js';
import type { SchemaContentTypeChange } from '../graphql/type-system/types/SchemaContentTypeChange.js';
import type { SchemaFieldChange } from '../graphql/type-system/types/SchemaFieldChange.js';
import type { SchemaFieldValidationChange } from '../graphql/type-system/types/SchemaFieldValidationChange.js';
import type { SchemaEnumValueChange } from '../graphql/type-system/types/SchemaEnumValueChange.js';
import type { SchemaUnionMemberChange } from '../graphql/type-system/types/SchemaUnionMemberChange.js';
import type { SchemaAttributeChange } from '../graphql/type-system/types/SchemaAttributeChange.js';
import type { SchemaChangeType } from '../graphql/type-system/enums/SchemaChangeType.js';
import type { SchemaChangeSeverity } from '../graphql/type-system/enums/SchemaChangeSeverity.js';

const logger = require('../utils/ora-logger.js');
const chalk = require('chalk');

function indentLines(str: string, spaces: number): string {
  return str.split('\n').reduce((res: string, line: string) => {
    return line ? `${res}${' '.repeat(spaces)}${line}\n` : res;
  }, '');
}

function colorLine(
  severity: SchemaChangeSeverity,
  line: string,
  description: ?string
): string {
  let desc;
  switch (severity) {
    case 'BREAKING':
      desc = description ? ' ' + chalk.bgRed.white(` ${description} `) : '';
      return chalk.red(line) + desc + '\n';
    case 'DANGEROUS':
      desc = description ? ' ' + chalk.bgYellow.black(` ${description} `) : '';
      return chalk.yellow(line) + desc + '\n';
    default:
      return chalk.white(line) + '\n';
  }
}

function getSchemaChangeType(changeType: SchemaChangeType): string {
  switch (changeType) {
    case 'CREATED':
      return '(+)';
    case 'UPDATED':
      return '(~)';
    case 'DELETED':
      return '(-)';
    default:
      return '   ';
  }
}

function getAttributeChange(attributeChange: SchemaAttributeChange): string {
  const { type, severity, name, from, to = '', description } = attributeChange;
  const typeStr = getSchemaChangeType(type);
  const valueStr = from
    ? `${JSON.stringify(from)} -> ${JSON.stringify(to)}`
    : JSON.stringify(to);

  return colorLine(severity, `${typeStr} ${name}: ${valueStr}`, description);
}

function getEnumValueChange(enumValueChange: SchemaEnumValueChange): string {
  let res = '';

  const { type, severity, name, description } = enumValueChange;
  const typeStr = getSchemaChangeType(type);

  res += colorLine(severity, `${typeStr} Enum value "${name}"`, description);

  const { attributeChanges = [] } = enumValueChange;

  if (type != 'DELETED') {
    for (let attributeChange of attributeChanges) {
      res += indentLines(getAttributeChange(attributeChange), 2);
    }
  }

  return res;
}

function getUnionMemberChange(
  unionMemberChange: SchemaUnionMemberChange
): string {
  let res = '';

  const { type, severity, name, description } = unionMemberChange;
  const typeStr = getSchemaChangeType(type);

  res += colorLine(severity, `${typeStr} Union member "${name}"`, description);

  const { attributeChanges = [] } = unionMemberChange;

  if (type != 'DELETED') {
    for (let attributeChange of attributeChanges) {
      res += indentLines(getAttributeChange(attributeChange), 2);
    }
  }

  return res;
}

function getFieldValidationChange(
  fieldValidationChange: SchemaFieldValidationChange
) {
  let res = '';

  const { type, severity, name, description } = fieldValidationChange;
  const typeStr = getSchemaChangeType(type);

  res += colorLine(severity, `${typeStr} Validation "${name}"`, description);

  const { attributeChanges = [] } = fieldValidationChange;

  if (type != 'DELETED') {
    for (let attributeChange of attributeChanges) {
      res += indentLines(getAttributeChange(attributeChange), 2);
    }
  }

  return res;
}

function getFieldChange(fieldChange: SchemaFieldChange): string {
  let res = '';

  const { type, severity, name, description } = fieldChange;
  const typeStr = getSchemaChangeType(type);

  res += colorLine(severity, `${typeStr} Field "${name}"`, description);

  const { attributeChanges = [], validationChanges = [] } = fieldChange;

  if (type != 'DELETED') {
    for (let attributeChange of attributeChanges) {
      res += indentLines(getAttributeChange(attributeChange), 2);
    }
    for (let fieldValidationChange of validationChanges) {
      res += indentLines(getFieldValidationChange(fieldValidationChange), 2);
    }
  }

  return res;
}

function getContentTypeChange(
  contentTypeChange: SchemaContentTypeChange
): string {
  let res = '';

  const { type, severity, name, description } = contentTypeChange;
  const typeStr = getSchemaChangeType(type);

  res += colorLine(severity, `${typeStr} Content type "${name}"`, description);

  const {
    attributeChanges = [],
    fieldChanges = [],
    enumValueChanges = [],
    unionMemberChanges = [],
  } = contentTypeChange;

  if (type != 'DELETED') {
    for (let attributeChange of attributeChanges) {
      res += indentLines(getAttributeChange(attributeChange), 2);
    }
    for (let fieldChange of fieldChanges) {
      res += indentLines(getFieldChange(fieldChange), 2);
    }
    for (let enumValueChange of enumValueChanges) {
      res += indentLines(getEnumValueChange(enumValueChange), 2);
    }
    for (let unionMemberChange of unionMemberChanges) {
      res += indentLines(getUnionMemberChange(unionMemberChange), 2);
    }
  }

  return res;
}

module.exports = function(schemaDiff: SchemaDiffResult) {
  if (schemaDiff.contentTypeChanges.length === 0) {
    logger.info('No changes found.');
    return;
  }

  let str = 'Found the following changes:\n\n';

  let hasBreakingChange = false;
  let hasDangerousChange = false;
  for (let contentTypeChange of schemaDiff.contentTypeChanges) {
    if (contentTypeChange.severity === 'DANGEROUS') {
      hasDangerousChange = true;
    }

    if (contentTypeChange.severity === 'BREAKING') {
      hasBreakingChange = true;
    }

    str += getContentTypeChange(contentTypeChange) + '\n';
  }

  logger.info(str);

  if (hasBreakingChange) {
    logger.fail('The schema can not be applied as it has breaking changes.');
  } else if (hasDangerousChange) {
    logger.warn(
      'Some of the changes might be dangerous, please double check the schema before applying.'
    );
  }
};
