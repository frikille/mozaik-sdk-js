// @flow
const MozaikAPI = require('../../api');

const resetProjectMutation = `
  mutation ResetProject($projectId: ID! $resetType: ProjectResetTypeEnum!) {
    resetProject(projectId: $projectIdid resetType: $resetType) {
      project {
        id
      }
      errors {
        key
        message
      }
    }
  }
`;

type ProjectResetType = 'CONTENT_TYPES' | 'DOCUMENTS' | 'ASSETS';

type Options = {
  projectId: string,
  resetType: ProjectResetType,
};

async function resetProject({ projectId, resetType }: Options) {
  return MozaikAPI.call({
    query: resetProjectMutation,
    variables: {
      projectId,
      resetType,
    },
    operationName: 'resetProject',
  });
}

module.exports = resetProject;
