jest.mock('../../api.js');
const MozaikAPI = require('../../api.js');
const createAsset = require('./index.js');

describe('Asset create function', () => {
  it('works fine', async () => {
    const asset = {
      url: 'http://foo.bar',
    };

    createAsset({ asset });

    expect(MozaikAPI.call).toHaveBeenCalledWith(
      expect.objectContaining({ variables: { asset } })
    );
  });
});
