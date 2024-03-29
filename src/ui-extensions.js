/* exported onOpen, getUserSettings */

/**
 * Used to setup Google Apps Script Spreadsheet trigger.
 * This should be used to define the corresponding onOpen
 * trigger in a Apps script connected to a spreadSheet.
 *
 * @param {object} e - onOpen event (unused)
 * @param {string} libraryName - Name the GS in the Spreadsheet setup.
 */
function onOpen(e, libraryName) {
  const ui = SpreadsheetApp.getUi();

  ui.createMenu('Metabase')
    .addItem('Initialize Metabase', `${libraryName}.initializeMetabase`)
    .addItem('Preview Query', `${libraryName}.queryPreviewInput`)
    .addItem('Delete User Data', `${libraryName}.deleteUserData`)
    .addItem(
      'Create Reports from Selected Cards',
      `${libraryName}.createReportFromSelected`,
    )
    .addItem('Uncheck All Checkboxes', `${libraryName}.uncheckAllCheckboxes`)
    .addToUi();
}

/* eslint-disable no-unused-vars */
/**
 * Removes metabase specific information, namely email, username and password,
 * from the users property storage.
 */
function deleteUserData() {
  /* eslint-enable no-unused-vars */
  PropertiesService.getUserProperties().deleteAllProperties();
}

/**
 * Extracts metabase specific configuration from user storage.
 * This is simply a convenience function to be used inside html templates.
 * from the users property storage.
 * @return {Array.<string>} Array with username, password and metabaseUrl.
 */
function getUserSettings() {
  const scriptProperties = PropertiesService.getUserProperties();
  const user = scriptProperties.getProperty('user');
  const password = scriptProperties.getProperty('password');
  const metabaseUrl = scriptProperties.getProperty('metabaseUrl');
  return [user, password, metabaseUrl];
}

/* eslint-disable no-unused-vars */
/**
 * Initializes metabase credentials and pulls card information.
 */
function initializeMetabase() {
  /* eslint-enable no-unused-vars */
  const ui = SpreadsheetApp.getUi();

  const html = HtmlService.createTemplateFromFile('init-metabase')
    .evaluate()
    .setWidth(450)
    .setHeight(300);

  ui.showModalDialog(html, 'Please provide Metabase credentials.');
}

/* eslint-disable no-unused-vars */
/**
 * Prompt to preview a metabase query.
 */
function queryPreviewInput() {
  /* eslint-enable no-unused-vars */
  const ui = SpreadsheetApp.getUi();

  // Promts are much easier to work with than modal dialogs,
  // but are limited to a single input.
  const result = ui.prompt(
    'Which query do you want to preview',
    ui.ButtonSet.OK_CANCEL,
  );

  const button = result.getSelectedButton();
  const id = result.getResponseText();
  if (button == ui.Button.OK) {
    previewQuery(id);
  } else if (button == ui.Button.CANCEL) {
    ui.alert('No id provided');
  } else if (button == ui.Button.CLOSE) {
    ui.alert('You closed the dialog.');
  }
}

/**
 *  Run a metabase query and create an example sheet.
 *  @param {int} id - Id of the query to run
 */
function previewQuery(id) {
  insertSheetWithQueryResults(
    id,
    'preview',
    SpreadsheetApp.getActiveSpreadsheet(),
  );
}

/* eslint-disable no-unused-vars */
/**
 * Processes user input, stores it, and initializes a Google Sheet document
 * @param {Array.<string>} values - Array containing username,
 * password and metabaseUrl
 */
function processCredentials(values) {
  /* eslint-enable no-unused-vars */
  storeUserInput(values);
  insertDataIntoSheet();
}

/**
 * Stores user credentials in user properties for future use.
 * @param {Array.<string>} values - Array containing username,
 * password and metabaseUrl
 */
function storeUserInput(values) {
  console.log('executing backend function');
  const scriptProperties = PropertiesService.getUserProperties();
  scriptProperties.setProperty('user', values[0]);
  scriptProperties.setProperty('password', values[1]);
  scriptProperties.setProperty('metabaseUrl', values[2]);
}

/**
 * Initializes a Sheet and inserts a list of cards
 * from a metabase collection into the sheet.
 */
function insertDataIntoSheet() {
  const scriptProperties = PropertiesService.getUserProperties();
  const user = scriptProperties.getProperty('user');
  const password = scriptProperties.getProperty('password');
  const metabaseUrl = scriptProperties.getProperty('metabaseUrl');

  const client = new MetabaseClient(user, password, metabaseUrl);

  const allCards = getAllCards(client);
  console.log(allCards);
  const sheet = SpreadsheetApp.getActiveSheet();
  sheet.getRange(`B1:D${allCards.length}`).setValues(allCards);
  sheet.getRange(`A2:A${allCards.length}`).insertCheckboxes();
  sheet.getRange(1, 1, 1, 1).setValues([['create_report']]);
}

/**
 * Inserts a new sheet into the given spreadsheet with data
 * and chart generated from query results.
 * @param {int} id - Id of the query to run.
 * @param {String} sheetName - name of the sheet to be inserted.
 * @param {Spreadsheet} spreadSheet - reference to Spreadsheet object.
 */
function insertSheetWithQueryResults(id, sheetName, spreadSheet) {
  const scriptProperties = PropertiesService.getUserProperties();
  const user = scriptProperties.getProperty('user');
  const password = scriptProperties.getProperty('password');
  const metabaseUrl = scriptProperties.getProperty('metabaseUrl');

  const client = new MetabaseClient(user, password, metabaseUrl);

  const results = getQueryResult(client, id);

  const sheet = spreadSheet.insertSheet(sheetName);
  fillDataAndChart(sheet, results.data, results.name);
}

/* eslint-disable no-unused-vars */
/**
 * Creates a report preview for each checkbox marked.
 */
function createReportFromSelected() {
  /* eslint-enable no-unused-vars */
  const rows = SpreadsheetApp.getActiveSheet().getDataRange().getValues();
  rows.shift();
  rows.forEach(function (row) {
    if (row[0]) {
      insertSheetWithQueryResults(
        row[3],
        `preview card id: ${row[3]}`,
        SpreadsheetApp.getActiveSpreadsheet(),
      );
    }
  });
}

/* eslint-disable no-unused-vars */
/**
 * Uncheck all ckeckboxes.
 */
function uncheckAllCheckboxes() {
  /* eslint-enable no-unused-vars */
  const sheet = SpreadsheetApp.getActiveSheet();
  sheet.getRange('A:A').uncheck();
}
