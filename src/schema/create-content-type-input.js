/* eslint no-unused-vars: 0 */
const createFieldInput = require('./create-field-input.js');

module.exports = function createContentTypeInput(definition) {
  const { kind, name, interfaces, directives, fields } = definition;

  if (kind === 'ObjectTypeDefinition') {
    return {
      name: name.value,
      apiId: name.value,
      fields: fields.map(f => createFieldInput(f)),
    };
  }

  return {};
};
