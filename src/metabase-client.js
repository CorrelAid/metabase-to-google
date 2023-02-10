/* exported runGetQueryExample, test */

/**
 * Client for the Metabase API
 */
class MetabaseClient {
  // static api_uri = '/api';

  /**
   * Create a MetabaseAPI client.
   * @param {string} username - Metabase username
   * @param {string} password - Metabase password
   * @param {string} metabaseUrl - Metabase URL
   */
  constructor(username, password, metabaseUrl) {
    this.username = username;
    this.password = password;
    this.metabaseUrl = metabaseUrl;

    const scriptProperties = PropertiesService.getUserProperties();

    if (scriptProperties.getKeys().includes('token')) {
      console.log('Using cached token');
      this.token = scriptProperties.getProperty('token');
    }
  }

  /**
   * Fetch http requests with automatic authorization.
   * @param {string} url - Request url
   * @param {Object} config - A config understood by GS's UrlFetchApp.fetch
   * @param {boolean} autoTokenRenewal - flag that controlls a single token
   * renewal attempt on 401 responses
   * @return {Object} - Parsed json response
   */
  authorizedFetch(url, config = {method: 'GET'}, autoTokenRenewal = true) {
    if (!('token' in this)) {
      console.log('No token available. Fetching new token.');
      this.getToken();
    }
    const authenticatedConfig = JSON.parse(JSON.stringify(config));

    if ('headers' in authenticatedConfig) {
      authenticatedConfig['headers']['X-Metabase-Session'] = this.token;
    } else {
      authenticatedConfig['headers'] = {'X-Metabase-Session': this.token};
    }
    authenticatedConfig['muteHttpExceptions'] = true;

    let response = UrlFetchApp.fetch(url, authenticatedConfig);
    if (response.getResponseCode() === 401 && autoTokenRenewal) {
      console.log('retry authentication');
      delete this.token;
      response = this.authorizedFetch(url, config, false);
    }
    if (response.getResponseCode() !== 200) {
      throw new Error(
        `Got response ${response.getResponseCode()} for request.`,
      );
    }
    return JSON.parse(response);
  }

  /**
   * Fetch a metabase token and store it internally as well as cache it in GS.
   */
  getToken() {
    const tokenUrl = `${this.metabaseUrl}/api/session`;
    const body = {
      username: `${this.username}`,
      password: `${this.password}`,
    };

    const config = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      payload: JSON.stringify(body),
    };

    const response = UrlFetchApp.fetch(tokenUrl, config);
    const respJson = JSON.parse(response);
    this.token = respJson['id'];
    const scriptProperties = PropertiesService.getUserProperties();
    scriptProperties.setProperty('token', this.token);
  }

  /**
   * Run the query belonging to a metabase query and fetch the results.
   * @param {int} id - Id of the card for which the query should be run.
   * @return {Object} - Query results
   */
  getCardQueryResults(id) {
    const config = {
      method: 'POST',
    };

    const url = `${this.metabaseUrl}/api/card/${id}/query/json`;
    return this.authorizedFetch(url, config);
  }

  /**
   * Get properties of a metabase card
   * @param {int} id - Id of the card for which to fetch properties.
   * @return {Object} - Card details
   */
  getCard(id) {
    const url = `${this.metabaseUrl}/api/card/${id}`;
    return this.authorizedFetch(url);
  }

  /**
   * Get get all collections
   * @return {Array.<Object>} - Collections
   */
  getCollections() {
    const url = `${this.metabaseUrl}/api/collection/`;
    return this.authorizedFetch(url);
  }

  /**
   * Get get items in a collection
   * @param {int} collectionId - Id of the collection to get the items for.
   * @return {Array.<Object>} - Items
   */
  getItems(collectionId) {
    const url = `${this.metabaseUrl}/api/collection/${collectionId}/items`;
    return this.authorizedFetch(url);
  }
}

/**
 * Fetches names and ids for all cards in all collections
 * @param {Object} client - Instance of the metabase client
 * @return {Array.<Object>} - All cards
 */
function getAllCards(client) {
  const collection = client.getCollections();
  const allCards = collection
    .flatMap((collection) =>
      client.getItems(collection['id'])['data'].map((item) => {
        item['collection'] = collection['name'];
        return item;
      }),
    )
    .filter((item) => item['model'] === 'card')
    .map((card) => {
      const {collection, name, id} = card;
      return [collection, name, id];
    });
  allCards.unshift(['collection', 'card_name', 'card_id']);
  return allCards;
}

/**
 * Create QueryResults for a card using a metabase client.
 * @param {Object} client - Instance of the metabase client
 * @param {int} cardId - Id of the card for which to create QueryResults
 * @return {Object} - Query Results
 */
function getQueryResult(client, cardId) {
  const data = client.getCardQueryResults((id = cardId));
  const cardDetails = client.getCard((id = cardId));
  const transformedData = data.map((row) => Object.values(row));
  transformedData.unshift(Object.keys(data[0]));
  return new QueryResult(cardDetails['name'], transformedData);
}

/**
 * Example run
 */
function runGetQueryExample() {
  const scriptProperties = PropertiesService.getScriptProperties();
  const user = scriptProperties.getProperty('user');
  const password = scriptProperties.getProperty('password');
  const client = new MetabaseClient(
    user,
    password,
    'https://metabase.citizensforeurope.org',
  );
  console.log(getQueryResult(client, 147));
}

/**
 * Test function
 */
function test() {
  const scriptProperties = PropertiesService.getScriptProperties();
  const user = scriptProperties.getProperty('user');
  const password = scriptProperties.getProperty('password');
  const client = new MetabaseClient(
    user,
    password,
    'https://metabase.citizensforeurope.org',
  );
  console.log(getAllCards(client));
}
