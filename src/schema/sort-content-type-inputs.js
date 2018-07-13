// @flow

import type { ContentTypeInput } from '../content-types/create/index.js';

class Node {
  contentTypeInput: ContentTypeInput;
  edges: Array<Node>;

  constructor(contentTypeInput: ContentTypeInput) {
    this.contentTypeInput = contentTypeInput;
    this.edges = [];
  }

  addDependencyEdge(node: Node) {
    this.edges.push(node);
  }
}

function buildDependecyGraph(contentTypeInputs: Array<ContentTypeInput>) {
  const nodesByAPIId = {};
  const nodes = contentTypeInputs.map(cti => {
    const node = new Node(cti);
    nodesByAPIId[cti.apiId] = node;
    return node;
  });

  nodes.forEach(node => {
    // Visit all fields and if a field type is not primitive push add as dependecy

    const { fields = [] } = node.contentTypeInput;

    fields.forEach(field => {
      switch (field.type) {
        case 'TEXT_SINGLELINE':
        case 'TEXT_MULTILINE':
        case 'DATE':
        case 'DATE_TIME':
        case 'RICH_TEXT':
        case 'INTEGER':
        case 'FLOAT':
        case 'BOOLEAN':
        case 'VIDEO':
        case 'IMAGE':
        case 'AUDIO':
        case 'FILE':
          break;
        default:
          node.addDependencyEdge(nodesByAPIId[field.type]);
      }
    });
  });

  return nodes;
}

function resolveDependency(
  node: Node,
  resolved: Set<Node>,
  unresolved: Set<Node>,
  visited: Set<Node>
) {
  unresolved.add(node);
  visited.add(node);

  node.edges.forEach(n => {
    if (!resolved.has(n) && !visited.has(n)) {
      resolveDependency(n, resolved, unresolved, visited);
    }
  });

  resolved.add(node);
  unresolved.delete(node);
}

module.exports = function sortContentTypeInputs(
  contentTypeInputs: Array<ContentTypeInput>
) {
  const nodes = buildDependecyGraph(contentTypeInputs);
  const resolved: Set<Node> = new Set();
  const unresolved: Set<Node> = new Set();
  const visited: Set<Node> = new Set();

  while (nodes.length > 0) {
    const node = nodes.pop();
    resolveDependency(node, resolved, unresolved, visited);
  }

  return Array.from(resolved).map(n => n.contentTypeInput);
};
