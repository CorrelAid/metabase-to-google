async function fetchCardIdCSV(id = 28) {
  const config = {
    muteHttpExceptions: true,
    method: "POST",
    headers: { "X-Metabase-Session": token },
  };

  const url = `${baseUrl}/api/card/${id}/query/csv`;

  // Fetch
  const response = UrlFetchApp.fetch(url, config);

  // Parse Response Blob to String
  const result = response.getBlob().getDataAsString();
  //console.log(result);

  // Parse String to CSV (GAS Generic Utility)
  const parsed = Utilities.parseCsv(result);

  const indexNumeric = parsed[0].length > 2 ? parsed[0].length - 1 : 1;
  parsed.forEach((row) => (row[indexNumeric] = Number(row[indexNumeric])));

  // Rename Columns
  parsed[0][0] = "Level";
  parsed[0][indexNumeric] = "Count";
  // console.log(parsed);

  return parsed;
}
