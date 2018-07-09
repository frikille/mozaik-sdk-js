const createProject = require('./create');
const deleteProject = require('./delete');
const resetProject = require('./reset');
const updateProject = require('./update');

const project = {
  create: createProject,
  destroy: deleteProject,
  reset: resetProject,
  update: updateProject
};

module.exports = project;
