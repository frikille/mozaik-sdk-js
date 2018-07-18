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
    console.error(err); //eslint-disable-line
  }
}

if (!apiEndpoint) {
  apiEndpoint = process.env.MOZAIK_API_ENDPOINT;
}

if (!accessToken) {
  accessToken = process.env.MOZAIK_ACCESS_TOKEN;
}

const credentials = {
  API_ENDPOINT: apiEndpoint,
  ACCESS_TOKEN: accessToken,
};

module.exports = credentials;
