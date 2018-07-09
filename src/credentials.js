// const fs = require('fs');
// const path = require('path');

let apiEndpoint;
let accessToken;
let workspaceName;

workspaceName = process.env.MOZAIK_WORKSPACE;
apiEndpoint = process.env.MOZAIK_API_ENDPOINT;
accessToken = process.env.MOZAIK_ACCESS_TOKEN;

const credentials = {
  API_ENDPOINT: apiEndpoint,
  ACCESS_TOKEN: accessToken,
  WORKSPACE_NAME: workspaceName,
};

module.exports = credentials;
