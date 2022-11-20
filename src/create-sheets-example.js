function randomData(number_rows, number_cols) {
  var data = []
  for (let row_number = 0; row_number < number_rows; row_number++) {
    var row = []
    for (let col_number = 0; col_number < number_cols; col_number++) {
      row.push(Math.random())
    }
    data.push(row)
  }
  return data
}

queryResult1 = QueryResult(
  (name = 'My first (fake) test query'),
  (data = randomData(10, 5))
)

queryResult2 = QueryResult(
  (name = 'My second test query'),
  (data = randomData(2, 2))
)

queryResult3 = QueryResult(
  (name = 'My third test query'),
  (data = randomData(5, 3))
)

queries = [queryResult1, queryResult2, queryResult3]

function getFolder(folder_name) {
  var files = DriveApp.getFolders()
  while (files.hasNext()) {
    var file = files.next()
    if (file.getName() === folder_name) {
      return file
    }
  }
  return DriveApp.createFolder(folder_name)
}

function createEmptySpreadsheet(
  name = 'GAS_TEST_SHEET',
  folder_name = 'my_gs_tests'
) {
  let folder = getFolder(folder_name)
  let sheet = SpreadsheetApp.create(name)
  let file = DriveApp.getFileById(sheet.getId())
  file.moveTo(folder)
  return sheet
}

function fillData(spreadSheet, values) {
  let number_rows = values.length
  let number_cols = values[0].length
  let range = `R1C1:R${number_rows}C${number_cols}`
  spreadSheet.getRange(range).setValues(values)
}

function exportQueryToSheet(query) {
  console.log(`Creating file ${query.name}`)
  spreadSheet = createEmptySpreadsheet((name = query.name))
  try {
    fillData(spreadSheet, query.data)
  } catch (error) {
    console.error(error)
    console.log(`Deleting file ${query.name}.`)
    DriveApp.removeFile(DriveApp.getFileById(spreadSheet.getId()))
  }
}

function main() {
  for (query of queries) {
    exportQueryToSheet(query)
  }
}
