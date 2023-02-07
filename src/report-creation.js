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

/** Embeds a Chart into a sheet where fillData() has been called.
 * Assumes that tabular data is located in the sheet's upper left corner.
 * @param {Object} sheet - sheet to embed a chart into.
 * @param {Array<Array.<number>>} values - 2D array of values inside \
 * the sheet, to add as range to the chart builder.
 * @param {String} chartTitle - query name or sheet title.
 */
function buildChart(sheet, values, chartTitle) {
  const chartBuilder = sheet.newChart()
    .setChartType(Charts.ChartType.BAR)
    .addRange(sheet.getRange(2, 1, values.length, values[0].length))
    .setPosition(2, 6, 0, 0)
    .setOption('title', `${chartTitle}`)
    .setOption('titleTextStyle', {
      color: 'black',
      fontSize: 18,
    } )
    .setOption('vAxis.title', `${values[0][0]}`)
    .setOption('hAxis.title', `${values[0][1]}`)
    .build();
  sheet.insertChart(chartBuilder);
}
