// @flow
const resetProject = require('./index');

type Options = {
  projectId: string,
};

module.exports = function resetProjectContentTypes({ projectId }: Options) {
  return resetProject({
    projectId,
    resetType: 'CONTENT_TYPES',
  });
};
