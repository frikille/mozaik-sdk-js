const fs = require('fs');
const toml = require('toml');
const fileExists = require('./utils/file-exists.js');

let mozaikrc;
let apiEndpoint;
let accessToken;

const profile = process.env.MOZAIK_PROFILE || 'default';

if (fileExists('.mozaikrc')) {
  try {
    mozaikrc = toml.parse(fs.readFileSync('.mozaikrc'))[profile];

    if (mozaikrc) {
      apiEndpoint = mozaikrc.api_endpoint;
      accessToken = mozaikrc.api_access_key;
    }
  } catch (err) {
    throw err;
  }
}

if (!apiEndpoint || process.env.MOZAIK_API_ENDPOINT) {
  apiEndpoint = process.env.MOZAIK_API_ENDPOINT;
}

if (!accessToken || process.env.MOZAIK_API_ACCESS_KEY) {
  accessToken = process.env.MOZAIK_API_ACCESS_KEY;
}

const credentials = {
  API_ENDPOINT: apiEndpoint,
  ACCESS_TOKEN: accessToken,
};

module.exports = credentials;
