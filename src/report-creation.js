/* exported buildChart, fillData, exportQueryToSheet */

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

/** Fills a sheet with a data matrix
 * @param {Object} sheet - sheet to be filled with values.
 * @param {Array<Array.<number>>} values - 2D array of values to be
 * inserted into the sheet.
 */
function fillData(sheet, values) {
  const numberRows = values.length;
  const numberCols = values[0].length;
  const range = `R1C1:R${numberRows}C${numberCols}`;
  sheet.getRange(range).setValues(values);
}

/** Fills a spreadsheet with a data matrix.
 ** Embeds a chart into the active sheet.
 * @param {Object} sheet - A Sheet to be filled with values and a chart
 * @param {Array<Array.<number>>} values - 2D array of values to be
 * inserted into the sheet.
 * @param {string} name - Name to be used for the chart.
 */
function fillDataAndChart(sheet, values, name) {
  fillData(sheet, values);
  buildChart(sheet, values, name);
}

/** Creates and fills a spreadsheet given query results
 * @param {Object} query - Query to be exported to a spreadsheet
 */
function exportQueryToSheet(query) {
  console.log(`Creating file and chart: ${query.name}`);
  spreadSheet = createEmptySpreadsheet((name = query.name));
  sheet = spreadSheet.getSheets()[0];
  try {
    fillDataAndChart(sheet, query.data, query.name);
  } catch (error) {
    console.error(error);
    console.log(`Deleting file ${query.name}.`);
    DriveApp.removeFile(DriveApp.getFileById(spreadSheet.getId()));
  }
}

/** Embeds a Chart into a sheet where fillData() has been called.
 * Assumes that tabular data is located in the sheet's upper left corner.
 * @param {Object} sheet - sheet to embed a chart into.
 * @param {Array<Array.<number>>} values - 2D array of values inside \
 * the sheet, to add as range to the chart builder.
 * @param {String} chartTitle - query name or sheet title.
 */
function buildChart(sheet, values, chartTitle) {
  const chartBuilder = sheet
    .newChart()
    .setChartType(Charts.ChartType.BAR)
    .addRange(sheet.getRange(2, 1, values.length, values[0].length))
    .setPosition(2, 6, 0, 0)
    .setOption('title', `${chartTitle}`)
    .setOption('titleTextStyle', {
      color: 'black',
      fontSize: 18,
    })
    .setOption('vAxis.title', `${values[0][0]}`)
    .setOption('hAxis.title', `${values[0][1]}`)
    .build();
  sheet.insertChart(chartBuilder);
}
