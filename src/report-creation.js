/* exported buildChart */

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

/** Embeds a Chart into a given sheet
 * @param {Object} sheet - sheet to embed a chart into.
 * @param {Array<Array.<number>>} values - 2D array of values inside \
 * the sheet, to add as range to the chart builder.
 * @param {String} chartTitle - query name or sheet title.
 */
function buildChart(sheet, values, chartTitle) {
  // Get sheets from sheet.
  const chartSheet = sheet.getSheets()[0];
  // Build chart for the sheet.
  const chartBuilder = chartSheet.newChart()
    .setChartType(Charts.ChartType.BAR)
    .addRange(chartSheet.getRange(2, 1, values.length, values[0].length))
    .setPosition(2, 6, 0, 0)
    .setOption('title', `${chartTitle}`)
    .setOption('titleTextStyle', {
      color: 'black',
      fontSize: 18,
    } )
    .setOption('vAxis.title', `${values[0][0]}`)
    .setOption('hAxis.title', `${values[0][1]}`)
    .build();

  // Insert chart into sheet.
  chartSheet.insertChart(chartBuilder);
}
