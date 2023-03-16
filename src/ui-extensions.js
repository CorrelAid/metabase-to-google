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
    .addItem('Get All cards', `${libraryName}.getListOfCards`)
    .addItem('Process Selected Cards', `${libraryName}.processSelected`)
    .addItem('Uncheck and Clear Selected', `${libraryName}.uncheckAndClear`)
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
 * Gets the list of cards (collection) into the overview table (bound sheet).
 */
function getListOfCards() {
  const ui = SpreadsheetApp.getUi();
  processCredentials([0, 1, 'https://metabase.citizensforeurope.org']);
}

/**
 * Runs previewQuery() function for each checkbox checked (card selected).
 */
function processSelected() {
  const ui = SpreadsheetApp.getUi();
  processSelectedRows();
}

/**
 * Unchecks all checkboxes and clears sheet formatting.
 */
function uncheckAndClear() {
  const ui = SpreadsheetApp.getUi();
  uncheckAndClearSelected();
}

/**
 *  Run a metabase query and create an example sheet.
 *  @param {int} id - Id of the query to run
 */
function previewQuery(id) {
  const spreadSheet = SpreadsheetApp.getActiveSpreadsheet();

  const scriptProperties = PropertiesService.getUserProperties();
  const user = scriptProperties.getProperty('user');
  const password = scriptProperties.getProperty('password');
  const metabaseUrl = scriptProperties.getProperty('metabaseUrl');

  const client = new MetabaseClient(user, password, metabaseUrl);

  const results = getQueryResult(client, id);

  const sheet = spreadSheet.insertSheet(`${results.name}`);
  fillDataAndChart(sheet, results.data, results.name);
}

/* eslint-disable no-unused-vars */
/**
 * Stores user credentials in user properties for future use.
 * Gets all cards into the active sheet (bound sheet),
 * and inserts checkboxes in column A (first column).
 * @param {Array.<string>} values - Array containing username,
 * password and metabaseUrl
 */
function processCredentials(values) {
  /* eslint-enable no-unused-vars */
  console.log('executing backend function');
  const scriptProperties = PropertiesService.getUserProperties();
  scriptProperties.setProperty('user', values[0]);
  scriptProperties.setProperty('password', values[1]);
  scriptProperties.setProperty('metabaseUrl', values[2]);

  const user = scriptProperties.getProperty('user');
  const password = scriptProperties.getProperty('password');
  const metabaseUrl = scriptProperties.getProperty('metabaseUrl');
  const client = new MetabaseClient(user, password, metabaseUrl);
  const allCards = getAllCards(client);
  console.log(allCards);
  SpreadsheetApp.getActiveSheet()
    .getRange(`B1:D${allCards.length}`)
    .setValues(allCards);
  SpreadsheetApp.getActiveSheet()
    .getRange(`A2:A${allCards.length}`)
    .insertCheckboxes();
  const headers = [['Create Report']];
  SpreadsheetApp.getActiveSheet()
    .getRange(1, 1, 1, 1).setValues(headers);
}

/**
 * Perform a simple action if a checkbox has being ckecked,
 * i.e. if the checkbox evaluates to True.
 */
function processSelectedRows() {
  const rows = SpreadsheetApp.getActiveSheet().getDataRange().getValues();
  const headers = rows.shift();
  rows.forEach(function(row) {
    if (row[0]) {
      previewQuery(row[3]);
    }
  } );
}

/**
 * Uncheck all ckeckboxes and clear all sheet formatting.
 */
function uncheckAndClearSelected() {
  const range1 = SpreadsheetApp.getActiveSheet();
  range1.getRange('A:A').uncheck();
  const range2 = SpreadsheetApp.getActiveSheet();
  range2.getRange('E:E').clear();
}
