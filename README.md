# Metabase API & Google Apps Script: Live-Connected Data Flow Metabase -> Google Sheets

## What is this project about?

One of two Metabase-centric projects (see [Metabase-to-Google](https://github.com/CorrelAid/metabase-to-google)). This project will explore automated approaches to (pre-)curating a Google Spreadsheet from a set of Metabase dashboards and saved queries ("cards") through the [Metabase API](https://www.metabase.com/docs/latest/api-documentation) and Google Apps Script. The imports in the Spreadsheet will stay live-connected to Metabase. Therefore, any changes in Metabase will be refelcted in the Spreadsheet (= "live-connected").

## This Repository

The repository currently contains a proof-of-concept fo using the Metabase API and Google Apps Script (JavaScript) to run a custom in-cell formula in Google Sheets `=fetchCardIdCSV(id)` to fetch the data from a single Metabase query (by card `id`)

> Setup copied from [fubits1/metabase-google-apps-script](https://github.com/fubits1/metabase-google-apps-script)

## Quickstart

> pre-requisite: Metabase session token  
> currently, token expires every 2 weeks for security reasons

- cf. [fubits1/metabase-api-demo](https://github.com/fubits1/metabase-api-demo) (Shell script work-in-progress)
- fetch with:

  ```{bash}
  curl -X POST \
      -H "Content-Type: application/json" \
      -d '{"username": "user", "password": "password"}' \
      https://your-metabase-url.org/api/session
  ```

### Manually

a) Copy/paste scripts from `./src/` as `.gs` into Apps Script project

### Programmatically from CLI

b) Local development with `node` & [`clasp`](https://github.com/google/clasp) ([Official Google Apps Script CLI](https://developers.google.com/apps-script/guides/clasp))

- `npm install`
- **NOTE**: enable Google Apps Script for user: [https://script.google.com/home/usersettings]
- `clasp login`
- get Script ID `<scriptID>` from Apps Script GUI
- copy the project config file example with `cp .clasp.json.example .clasp.json` and add ID and folder to `.clasp.json` file
  - (or if this repository were empty: clone from remote with `clasp clone <scriptID>`)
- open Remote / Apps Script GUI (browser) with `clasp open`

### Get Remote State

- pull with `clasp pull` - **WARN** will overwrite local state

### Deploy to Remote Project Environment

**deploy** your local state with `clasp push` to the remote project environment (will **overwrite** remote state)

### Remote Script Execution

> TBD
