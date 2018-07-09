const graphql = require("graphql");
const fs = require("fs");
const path = require("path");
const { parse, print } = graphql;

const query = `
query {
  advisor {
    univ {
      name
    }
  }
  friend {
    univ {
      name
    }
  }
}
`;

const parsedQuery = parse(query);

const tokens = {};

function addToken(definition) {
  const token = query.substring(definition.loc.start, definition.loc.end);
  tokens[token] = 1;

  if (definition.selectionSet) {
    definition.selectionSet.selections.forEach(d => addToken(d));
  }
}

function calculateSize(definition) {
  const token = query.substring(definition.loc.start, definition.loc.end);

  let size = tokens[token];

  if (size) {
    return size;
  }

  if (definition.selectionSet) {
    size =
      4 +
      definition.selectionSet.selections
        .map(d => calculateSize(d))
        .reduce((a, b) => a + b, 2);

    tokens[token] = size;
    return size;
  } else {
    tokens[token] = 1;

    return 1;
  }
}

const querySize =
  4 +
  parsedQuery.definitions[0].selectionSet.selections
    .map(d => calculateSize(d))
    .reduce((a, b) => a + b);
console.log(tokens);
console.log(`Query size is: ${querySize}`);
