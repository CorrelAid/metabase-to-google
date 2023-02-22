/* exported runGetQueryExample, getAllCardsExample, queryExportExample */

/**
 * Runs a metbase query and logs the results.
 * This method requires 'user', 'password' and 'metabase_url' to be set
 * as script properties. It also uses a hardcoded card ID (147) which needs
 * to exist.
 */
function runGetQueryExample() {
  const scriptProperties = PropertiesService.getScriptProperties();
  const user = scriptProperties.getProperty('user');
  const password = scriptProperties.getProperty('password');
  const metabaseUrl = scriptProperties.getProperty('metabase_url');
  const client = new MetabaseClient(user, password, metabaseUrl);
  console.log(getQueryResult(client, 147));
}

/**
 * Gets all metabase cards and logs the results.
 * This method requires 'user', 'password' and 'metabase_url' to be set
 * as script properties.  */
function getAllCardsExample() {
  const scriptProperties = PropertiesService.getScriptProperties();
  const user = scriptProperties.getProperty('user');
  const password = scriptProperties.getProperty('password');
  const metabaseUrl = scriptProperties.getProperty('metabase_url');
  const client = new MetabaseClient(user, password, metabaseUrl);
  console.log(getAllCards(client));
}

// Example data to create QueryResults
// of the same shape as the client output
const data1 = [
  ['Species', '# of Birds'],
  ['Adelie', '152'],
  ['Gentoo', '124'],
  ['Chinstrap', '68'],
];

const data2 = [
  ['Island', '# of Birds'],
  ['Biscoe', '168'],
  ['Dream', '124'],
  ['Torgersen', '52'],
];

const data3 = [
  ['Year', '# of Birds'],
  ['2007', '110'],
  ['2008', '120'],
  ['2009', '114'],
];

queryResult1 = new QueryResult(
  (name = 'Number of Birds by Species'),
  (data = data1),
);

queryResult2 = new QueryResult(
  (name = 'Number of Birds by Island'),
  (data = data2),
);

queryResult3 = new QueryResult(
  (name = 'Number of Birds by Year'),
  (data = data3),
);

queries = [queryResult1, queryResult2, queryResult3];

/** Creates Spreadsheets with example data.*/
function queryExportExample() {
  for (query of queries) {
    exportQueryToSheet(query);
  }
}
