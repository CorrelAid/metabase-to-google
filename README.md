# Metabase API & Google Apps Script: Live-Connected Data Flow Metabase -> Google Sheets

> Setup forked from [fubits1/metabase-google-apps-script](https://github.com/fubits1/metabase-google-apps-script)

Proof-of-concept: Using the Metabase API and Google Apps Script (JavaScript) to run a custom in-cell formula `=fetchCardIdCSV(id)` to fetch the data from a single Metabase query

## Quickstart

> pre-requisite: Metabase session token (cf. [fubits1/metabase-api-demo](https://github.com/fubits1/metabase-api-demo))

a) Copy/paste scripts from `./src/` as `.gs` into Apps Script project

b) Local development with `node` & [`clasp`](https://github.com/google/clasp) ([Official Google Apps Script CLI](https://developers.google.com/apps-script/guides/clasp))

- `npm install`
- **NOTE**: enable Google Apps Script for user: [https://script.google.com/home/usersettings]
- `clasp login`
- get Script ID `<scriptID>` from Apps Script GUI
- copy the project config file example with `cp .clasp.json.example .clasp.json` and add ID and folder to `.clasp.json` file
  - (or if this repository were empty: clone from remote with `clasp clone <scriptID>`)
- open Remote / Apps Script GUI (browser) with `clasp open`
- remote execution: tbd

### Get Remote State

- pull with `clasp pull` - **WARN** will overwrite local state

### Deploy to Remote Project Environment

**deploy** your local state with `clasp push` to the remote project environment (will overwrite remote state)
