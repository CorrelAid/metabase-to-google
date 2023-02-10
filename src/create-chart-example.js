/* exported main */

// Data arrays from Penguins table.
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

/** Fills a spreadsheet with a data matrix.
 ** Embeds a chart into the active sheet.
 * @param {Object} spreadSheet - Spreadsheet to be filled with values.
 * @param {Array<Array.<number>>} values - 2D array of values to be
 * inserted into the sheet.
 */
function fillDataAndChart(spreadSheet, values) {
  const numberRows = values.length;
  const numberCols = values[0].length;
  const range = `R1C1:R${numberRows}C${numberCols}`;
  spreadSheet.getRange(range).setValues(values);
  // Get active sheet from spreadsheet.
  const activeSheet = spreadSheet.getActiveSheet();
  // Create chart for the active sheet.
  const chartBuilder = activeSheet
    .newChart()
    .setChartType(Charts.ChartType.BAR)
    .addRange(activeSheet.getRange(2, 1, values.length, values[0].length))
    .setPosition(2, 6, 0, 0)
    .setOption('title', `${query.name}`)
    .setOption('titleTextStyle', {
      color: 'black',
      fontSize: 18,
    })
    .setOption('vAxis.title', `${values[0][0]}`)
    .setOption('hAxis.title', `${values[0][1]}`)
    .build();

  // Insert chart into active Sheet.
  activeSheet.insertChart(chartBuilder);
}

/** Creates and fills a spreadsheet given query results
 * @param {Object} query - Query to be exported to a spreadsheet
 */
function exportQueryToSheet(query) {
  console.log(`Creating file and chart: ${query.name}`);
  spreadSheet = createEmptySpreadsheet((name = query.name));
  try {
    fillDataAndChart(spreadSheet, query.data);
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
