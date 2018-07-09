const fetch = require('node-fetch');
const credentials = require('./credentials');

async function callApi({ apiEndpoint, accessToken, query, variables }) {
  if (!apiEndpoint || !accessToken) {
    throw new Error('API endpoint and accessToken must be set!');
  }

  try {
    const response = await fetch(apiEndpoint, {
      method: 'post',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query,
        variables
      })
    });

    const result = await response.json();

    return result;
  } catch (error) {
    console.error(error.stack);
  }
}

const API = {
  call(query, variables) {
    return callApi({
      query,
      variables,
      apiEndpoint: credentials.API_ENDPOINT,
      accessToken: credentials.ACCESS_TOKEN
    });
  }
};

module.exports = API;
