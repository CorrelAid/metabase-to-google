/* exported buildChart */

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

/** Embeds a Chart into a given sheet
 * @param {Object} spreadSheet - Spreadsheet to get active sheet from.
 * @param {Array<Array.<number>>} values - 2D array of values inside \
 * the sheet, to add as range to the chart builder.
 * @param {String} chartTitle - query name or spreadsheet title.
 */
function buildChart(spreadSheet, values, chartTitle) {
  // Get sheets from spreadsheet.
  const sheets = spreadSheet.getSheets()[0];
  // Build chart for the sheets.
  const chartBuilder = sheets.newChart()
    .setChartType(Charts.ChartType.BAR)
    .addRange(sheets.getRange(2, 1, values.length, values[0].length))
    .setPosition(2, 6, 0, 0)
    .setOption('title', `${chartTitle.name}`)
    .setOption('titleTextStyle', {
      color: 'black',
      fontSize: 18
    } )
    .setOption('vAxis.title', `${values[0][0]}`)
    .setOption('hAxis.title', `${values[0][1]}`)
    .build();

  // Insert chart into sheets.
  sheets.insertChart(chartBuilder);
}