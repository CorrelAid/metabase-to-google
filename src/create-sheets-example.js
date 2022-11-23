/* exported main */

/** Creates random data for sheet creation examples
 * @param {number} numberRows - Number of rows of random data.
 * @param {number} numberCols - Number of columns of random data.
 * @return {Array.<Array.<number>>} - 2D array of random data.
 */
function randomData(numberRows, numberCols) {
  const data = [];
  for (let rowNumber = 0; rowNumber < numberRows; rowNumber++) {
    const row = [];
    for (let colNumber = 0; colNumber < numberCols; colNumber++) {
      row.push(Math.random());
    }
    data.push(row);
  }
  return data;
}

queryResult1 = new QueryResult(
  (name = 'My first (fake) test query'),
  (data = randomData(10, 5)),
);

queryResult2 = new QueryResult(
  (name = 'My second test query'),
  (data = randomData(2, 2)),
);

queryResult3 = new QueryResult(
  (name = 'My third test query'),
  (data = randomData(5, 3)),
);

queries = [queryResult1, queryResult2, queryResult3];

/** Gets a folder, but fetching existing folder and creating non-existing ones
 * @param {string} folderName - Folder to fetch and possibly create.
 * @return {Object} - Folder Object
 */
function getFolder(folderName) {
  const files = DriveApp.getFolders();
  while (files.hasNext()) {
    const file = files.next();
    if (file.getName() === folderName) {
      return file;
    }
  }
  return DriveApp.createFolder(folderName);
}

/** Creates a spreadsheet in a specific drive folder
 * @param {string} name - Name of the spreadsheet to create.
 * @param {string} folderName - Folder were to create the spreadsheet.
 * @return {Object} - Sheet object.
 */
function createEmptySpreadsheet(
  name = 'GAS_TEST_SHEET',
  folderName = 'my_gs_tests',
) {
  const folder = getFolder(folderName);
  const sheet = SpreadsheetApp.create(name);
  const file = DriveApp.getFileById(sheet.getId());
  file.moveTo(folder);
  return sheet;
}

/** Fills a spreadsheet with a data matrix
 * @param {Object} spreadSheet - Spreadsheet to be filled with values.
 * @param {Array<Array.<number>>} values - 2D array of values to be
 * inserted into the sheet.
 */
function fillData(spreadSheet, values) {
  const numberRows = values.length;
  const numberCols = values[0].length;
  const range = `R1C1:R${numberRows}C${numberCols}`;
  spreadSheet.getRange(range).setValues(values);
}

/** Creates and fills a spreadsheet given query results
 * @param {Object} query - Query to be exported to a spreadsheet
 */
function exportQueryToSheet(query) {
  console.log(`Creating file ${query.name}`);
  spreadSheet = createEmptySpreadsheet((name = query.name));
  try {
    fillData(spreadSheet, query.data);
  } catch (error) {
    console.error(error);
    console.log(`Deleting file ${query.name}.`);
    DriveApp.removeFile(DriveApp.getFileById(spreadSheet.getId()));
  }
}

/** GS entrypoint */
function main() {
  for (query of queries) {
    exportQueryToSheet(query);
  }
}
