const credentials = require('./credentials.js');
const api = require('./api.js');
const asset = require('./asset/index.js');
const contentType = require('./content-types/index.js');
const document = require('./documents/index.js');
const field = require('./fields/index.js');
const project = require('./project/index.js');
const schema = require('./schema/index.js');

const Mozaik = {
  credentials,
  API: api,
  asset,
  contentType,
  document,
  field,
  project,
  schema,
};

module.exports = Mozaik;
