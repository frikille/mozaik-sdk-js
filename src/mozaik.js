const credentials = require('./credentials');
const api = require('./api');
const asset = require('./asset');
const contentType = require('./content-types');
const document = require('./documents');
const field = require('./fields');
const project = require('./project');

const Mozaik = {
  credentials,
  API: api,
  asset,
  contentType,
  document,
  field,
  project,
};

module.exports = Mozaik;
