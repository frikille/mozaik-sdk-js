const createDocument = require('./create');
const publishDocument = require('./publish');

const document = {
  create: createDocument,
  publish: publishDocument
};

module.exports = document;
