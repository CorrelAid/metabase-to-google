/* exported displayToast */

/** Display toast message in active Spreadsheet.
 * This function is deprecated as this project aims
 * to be used as a standalone scrip in GAS.
 * Stand alone scripts however, do not support
 * the .getActive() method that is being used.
 * @param {string} title - Title of a toast message.
 * @param {string} message - Message to be displayed.
 */
function displayToast(title, message) {
  console.log('Test: Toast');
  SpreadsheetApp.getActive().toast(message, title);
}
