/* exported QueryResult */

/** Results of a metabase query
 * @constructor
 * @param {string} name - Name of the result.
 * @param {Array.<Array.<number>>} data - 2D array of results.
 */
function QueryResult(name, data) {
  queryResults = {
    name: name,
    data: data,
  };
  return queryResults;
}
