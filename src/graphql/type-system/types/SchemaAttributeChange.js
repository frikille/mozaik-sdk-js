// @flow

import type { SchemaChangeType } from '../enums/SchemaChangeType.js';
import type { SchemaChangeSeverity } from '../enums/SchemaChangeSeverity.js';

const schemaAttributeChange = `
  type SchemaAttributeChange {
    type: SchemaChangeType!
    severity: SchemaChangeSeverity!
    name: String!
    from: String
    to: String
    description: String
  }
`;

module.exports = () => [schemaAttributeChange];

export type SchemaAttributeChange = {|
  type: SchemaChangeType,
  severity: SchemaChangeSeverity,
  name: string,
  from?: string,
  to?: string,
  description?: string,
|};
