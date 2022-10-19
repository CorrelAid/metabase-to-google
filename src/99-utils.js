function displayToast(title, message) {
  console.log("Test: Toast");
  SpreadsheetApp.getActive().toast(message, title);
}
