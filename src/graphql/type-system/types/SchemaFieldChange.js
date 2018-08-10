// @flow

import type { SchemaChangeType } from '../enums/SchemaChangeType.js';
import type { SchemaChangeSeverity } from '../enums/SchemaChangeSeverity.js';
import type { SchemaAttributeChange } from './SchemaAttributeChange.js';
import type { SchemaFieldValidationChange } from './SchemaFieldValidationChange.js';
import type { FieldInput, FieldUpdateInput } from '../inputs/Field.js';

const schemaFieldChange = `
  type SchemaFieldChange {
    type: SchemaChangeType!
    severity: SchemaChangeSeverity!
    name: String!
    attributeChanges: [SchemaAttributeChange]
    validationChanges: [SchemaFieldValidationChange]
    description: String
  }
`;

module.exports = () => [schemaFieldChange];

export type SchemaFieldChange = {|
  type: SchemaChangeType,
  severity: SchemaChangeSeverity,
  id?: string,
  name: string,
  attributeChanges: Array<SchemaAttributeChange>,
  validationChanges: Array<SchemaFieldValidationChange>,
  description?: string,
  input?: FieldInput | FieldUpdateInput,
|};
