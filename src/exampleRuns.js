/* exported runGetQueryExample, test */

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
