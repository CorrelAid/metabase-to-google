const {MetabaseClient} = require('../../src/metabase-client');

describe('Client', function () {
  let client;
  let userPropSpy;
  let urlFetcherSpy;

  beforeEach(function () {
    userPropSpy = jasmine.createSpyObj('userProperties', {
      getKeys: [],
      getProperty: null,
      setProperty: null,
    });
    urlFetcherSpy = jasmine.createSpy();
    urlFetcherSpy.and.returnValue(mockResponse(200, {id: 'fake_token'}));
  });

  it('should initialize wo token', function () {
    client = new MetabaseClient(
      'user',
      'pwd',
      'url',
      userPropSpy,
      urlFetcherSpy,
    );
    expect(userPropSpy.getKeys).toHaveBeenCalled();
    expect(client.token).toBeUndefined();
  });

  it('should initialize with token', function () {
    userPropSpy.getKeys.and.returnValue(['token']);
    userPropSpy.getProperty.and.returnValue('fake_token');
    client = new MetabaseClient(
      'user',
      'pwd',
      'url',
      userPropSpy,
      urlFetcherSpy,
    );
    expect(userPropSpy.getKeys).toHaveBeenCalled();
    expect(client.token).toEqual('fake_token');
  });

  it('should fetch and store token', function () {
    client = new MetabaseClient(
      'user',
      'pwd',
      'url',
      userPropSpy,
      urlFetcherSpy,
    );
    expect(client.token).toBeUndefined();

    client.getToken();
    expect(urlFetcherSpy).toHaveBeenCalled();
    expect(client.properties.setProperty).toHaveBeenCalled();
    expect(client.token).toEqual('fake_token');
  });

  it('should fetch token as part of fetch', function () {
    urlFetcherSpy.and.returnValues(
      mockResponse(200, {id: 'fake_token'}),
      mockResponse(200, {other: 'payload'}),
    );
    client = new MetabaseClient(
      'user',
      'pwd',
      'url',
      userPropSpy,
      urlFetcherSpy,
    );
    resp = client.authorizedFetch('www.fake_url.com');
    expect(urlFetcherSpy).toHaveBeenCalledTimes(2);
    expect(client.token).toEqual('fake_token');
    expect(resp.other).toEqual('payload');
  });

  it('should not fetch token as part of fetch if present', function () {
    userPropSpy.getKeys.and.returnValue(['token']);
    userPropSpy.getProperty.and.returnValue('fake_token');
    urlFetcherSpy.and.returnValues(mockResponse(200, {other: 'payload'}));
    client = new MetabaseClient(
      'user',
      'pwd',
      'url',
      userPropSpy,
      urlFetcherSpy,
    );
    resp = client.authorizedFetch('www.fake_url.com');
    expect(urlFetcherSpy).toHaveBeenCalledTimes(1);
    expect(resp.other).toEqual('payload');
  });

  it('should fetch token as part of fetch if present but expired', function () {
    userPropSpy.getKeys.and.returnValue(['token']);
    userPropSpy.getProperty.and.returnValue('fake_token');
    urlFetcherSpy.and.returnValues(
      mockResponse(401, {}),
      mockResponse(200, {id: 'other_token'}),
      mockResponse(200, {other: 'payload'}),
    );
    client = new MetabaseClient(
      'user',
      'pwd',
      'url',
      userPropSpy,
      urlFetcherSpy,
    );
    resp = client.authorizedFetch('www.fake_url.com');
    expect(urlFetcherSpy).toHaveBeenCalledTimes(3);
    expect(client.token).toEqual('other_token');
    expect(resp.other).toEqual('payload');
  });
});

/**
 * Create mock for UrlFetchApp.fetch response
 * @param {int} statusCode - Http Status Code
 * @param {Object} payload - Json data to include (will be stringified)
 * @return {Object} - Mocked response
 */
function mockResponse(statusCode = 200, payload) {
  return {
    getResponseCode: () => statusCode,
    toString: () => JSON.stringify(payload),
  };
}
