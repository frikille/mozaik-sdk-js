// @flow

import type { SchemaChangeType } from '../enums/SchemaChangeType.js';
import type { SchemaChangeSeverity } from '../enums/SchemaChangeSeverity.js';
import type { SchemaAttributeChange } from './SchemaAttributeChange.js';
import type { SchemaFieldChange } from './SchemaFieldChange.js';
import type { SchemaEnumValueChange } from './SchemaEnumValueChange.js';
import type { SchemaUnionMemberChange } from './SchemaUnionMemberChange.js';
import type {
  ContentTypeInput,
  ContentTypeUpdateInput,
} from '../inputs/ContentType.js';

const schemaContentTypeChange = `
  type SchemaContentTypeChange {
    type: SchemaChangeType!
    severity: SchemaChangeSeverity!
    name: String!
    attributeChanges: [SchemaAttributeChange]
    fieldChanges: [SchemaFieldChange]
    enumValueChanges: [SchemaEnumValueChange]
    unionMemberChanges: [SchemaUnionMemberChange]
    description: String
  }
`;

module.exports = () => [schemaContentTypeChange];

export type SchemaContentTypeChange = {|
  type: SchemaChangeType,
  severity: SchemaChangeSeverity,
  id?: string,
  name: string,
  attributeChanges?: Array<SchemaAttributeChange>,
  fieldChanges?: Array<SchemaFieldChange>,
  enumValueChanges?: Array<SchemaEnumValueChange>,
  unionMemberChanges?: Array<SchemaUnionMemberChange>,
  description?: string,
  input?: ContentTypeInput | ContentTypeUpdateInput,
|};
