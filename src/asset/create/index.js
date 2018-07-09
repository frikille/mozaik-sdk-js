const MozaikAPI = require('../../api');

const createAssetMutation = `
  mutation createAssetMutation($asset: AssetInput!) {
    createAsset(asset: $asset) {
      asset {
        id
      }
      errors {
        key
        message
      }
    }
  }
`;

function createAsset({ asset }) {
  return MozaikAPI.call({
    query: createAssetMutation,
    variables: {
      asset
    }
  });
}

module.exports = createAsset;
