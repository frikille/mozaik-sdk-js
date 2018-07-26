// @flow
const resetProject = require('./index');

type Options = {
  projectId: string,
};

module.exports = function resetProjectAssets({ projectId }: Options) {
  return resetProject({
    projectId,
    resetType: 'ASSETS',
  });
};
