async function fetchCardIdJSON(id = 29) {
  const config = {
    muteHttpExceptions: true,
    method: "POST",
    headers: { "X-Metabase-Session": token },
  };

  const url = `${baseUrl}/api/card/${id}/query/json`;
  const response = UrlFetchApp.fetch(url, config);
  const result = JSON.parse(response);

  /** rename value of (dynamic) label property */
  // get current label
  const valueLabelKey = Object.keys(result[0])[0];

  // create new label (incl. Count => count)
  result.forEach((entry) => {
    entry.label = entry[valueLabelKey];
    entry.count = entry.Count;
  });

  // drop old keys
  result.forEach((entry) => {
    delete entry[valueLabelKey];
    delete entry.Count;
  });

  console.log(result);

  return JSON.stringify(result);
}
