// @flow

import type { SchemaContentTypeChange } from './SchemaContentTypeChange.js';
const schemaContentTypeChange = require('./SchemaContentTypeChange.js');
const schemaFieldChange = require('./SchemaFieldChange.js');
const schemaFieldValidationChange = require('./SchemaFieldValidationChange.js');
const schemaAttributeChange = require('./SchemaAttributeChange.js');
const schemaEnumValueChange = require('./SchemaEnumValueChange.js');
const schemaUnionMemberChange = require('./SchemaUnionMemberChange.js');
const schemaChangeType = require('../enums/SchemaChangeType.js');
const schemaChangeSeverity = require('../enums/SchemaChangeSeverity.js');

const schemaDiffResult = `
  type SchemaDiffResult {
    contentTypeChanges: [SchemaContentTypeChange],
  }
`;

module.exports = () => [
  schemaDiffResult,
  schemaContentTypeChange,
  schemaFieldChange,
  schemaFieldValidationChange,
  schemaAttributeChange,
  schemaEnumValueChange,
  schemaUnionMemberChange,
  schemaChangeType,
  schemaChangeSeverity,
];

export type SchemaDiffResult = {|
  contentTypeChanges: Array<SchemaContentTypeChange>,
|};
