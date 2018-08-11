// @flow

import type { SchemaChangeType } from '../enums/SchemaChangeType.js';
import type { SchemaChangeSeverity } from '../enums/SchemaChangeSeverity.js';
import type { SchemaAttributeChange } from './SchemaAttributeChange.js';
import type {
  FieldValidationInput,
  FieldValidationUpdateInput,
} from '../inputs/FieldValidation.js';

const schemaFieldValidationChange = `
  type SchemaFieldValidationChange {
    type: SchemaChangeType!
    severity: SchemaChangeSeverity!
    name: String!
    attributeChanges: [SchemaAttributeChange]
    description: String
  }
`;

module.exports = () => [schemaFieldValidationChange];

export type SchemaFieldValidationChange = {|
  type: SchemaChangeType,
  severity: SchemaChangeSeverity,
  id?: number,
  name: string,
  attributeChanges: Array<SchemaAttributeChange>,
  description?: string,
  input?: FieldValidationInput | FieldValidationUpdateInput,
|};
