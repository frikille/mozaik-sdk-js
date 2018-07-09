// @flow
import createFieldInput from "./create-field-input";
import type { ObjectTypeDefinitionNode } from "graphql";

type ContentTypeInput = {
  apiId: string,
  name: string,
  fields: Array<FieldInput>
};

export default function createContentTypeInput(definition): ContentTypeInput {
  const { kind, name, interfaces, directives, fields } = definition;

  if (definition.kind === "ObjectTypeDefinition") {
    return {
      name: name.value,
      apiId: name.value,
      fields: fields.map(f => createFieldInput(f))
    };
  }

  return {};
}
