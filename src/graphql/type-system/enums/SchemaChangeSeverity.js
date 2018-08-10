// @flow

const schemaChangeSeverity = `
enum SchemaChangeSeverity {
  TRIVIAL
  DANGEROUS
  BREAKING
}
`;

module.exports = () => [schemaChangeSeverity];

export type SchemaChangeSeverity = 'TRIVIAL' | 'DANGEROUS' | 'BREAKING';
