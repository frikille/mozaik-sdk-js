// @flow

const schemaChangeType = `
enum SchemaChangeType {
  CREATED
  UPDATED
  DELETED
}
`;

module.exports = () => [schemaChangeType];

export type SchemaChangeType = 'CREATED' | 'UPDATED' | 'DELETED';
