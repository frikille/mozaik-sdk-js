// @flow
const resetProject = require('./index');

type Options = {
  projectId: string,
};

module.exports = function resetProjectDocuments({ projectId }: Options) {
  return resetProject({
    projectId,
    resetType: 'DOCUMENTS',
  });
};
