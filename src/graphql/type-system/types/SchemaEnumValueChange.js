// @flow

import type { SchemaChangeType } from '../enums/SchemaChangeType.js';
import type { SchemaChangeSeverity } from '../enums/SchemaChangeSeverity.js';
import type { SchemaAttributeChange } from './SchemaAttributeChange.js';

const schemaEnumValueChange = `
  type SchemaEnumValueChange {
    type: SchemaChangeType!
    severity: SchemaChangeSeverity!
    name: String!
    attributeChanges: [SchemaAttributeChange]
    description: String
  }
`;

module.exports = () => [schemaEnumValueChange];

export type SchemaEnumValueChange = {|
  type: SchemaChangeType,
  severity: SchemaChangeSeverity,
  name: string,
  attributeChanges: Array<SchemaAttributeChange>,
  description?: string,
|};
