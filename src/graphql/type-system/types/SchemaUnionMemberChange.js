// @flow

import type { SchemaChangeType } from '../enums/SchemaChangeType.js';
import type { SchemaChangeSeverity } from '../enums/SchemaChangeSeverity.js';
import type { SchemaAttributeChange } from './SchemaAttributeChange.js';

const schemaUnionMemberChange = `
  type SchemaUnionMemberChange {
    type: SchemaChangeType!
    severity: SchemaChangeSeverity!
    name: String!
    attributeChanges: [SchemaAttributeChange]
    description: String
  }
`;

module.exports = () => [schemaUnionMemberChange];

export type SchemaUnionMemberChange = {|
  type: SchemaChangeType,
  severity: SchemaChangeSeverity,
  name: string,
  attributeChanges?: Array<SchemaAttributeChange>,
  description?: string,
|};
