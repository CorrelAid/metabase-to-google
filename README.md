# Metabase API & Google Apps Script: Live-Connected Data Flow Metabase -> Google Sheets

## What is this project about?

One of two Metabase-centric projects (see 
[Metabase-to-Google](https://github.com/CorrelAid/metabase-to-google)). This project will explore
automated approaches to (pre-)curating a Google Spreadsheet from a set of Metabase dashboards and
saved queries ("cards") through the 
[ℹ️ Metabase API](https://www.metabase.com/docs/latest/api-documentation),
[ℹ️ Google Apps Script](https://developers.google.com/apps-script), and various Google APIs
(e.g. [ℹ️ Sheets API](https://developers.google.com/sheets/api)). The imports in the Spreadsheet
will stay live-connected to Metabase. Therefore, any changes in Metabase will be refelcted in the
Spreadsheet (= "live-connected").

## This Repository

The repository currently contains a proof-of-concept for using the Metabase API and Google Apps
Script (JavaScript) to run a custom in-cell formula in Google Sheets `=fetchCardIdCSV(id)`to fetch
the data from a single Metabase query (by card `id`)

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

b) Local development with `node` & [`clasp`](https://github.com/google/clasp)
([ℹ️ Official Google Apps Script CLI](https://developers.google.com/apps-script/guides/clasp)
| [🔥 Interactive Tutorial](https://codelabs.developers.google.com/codelabs/clasp/#0)
| [Copy & Paste Tutorial](https://developers.google.com/apps-script/quickstart/custom-functions))

- `npm install`
- **NOTE**: enable Google Apps Script for user: [https://script.google.com/home/usersettings]
- `clasp login`
- get Script ID `<scriptID>` from Apps Script GUI
- copy the project config file example with `cp .clasp.json.example .clasp.json` and add ID and
  folder to `.clasp.json` file
  - (or if this repository were empty: clone from remote with `clasp clone <scriptID>`)
- open Remote / Apps Script GUI (browser) with `clasp open`

### Get Remote State

- pull with `clasp pull` - **WARN** will overwrite local state

### Deploy to Remote Project Environment

**deploy** your local state with `clasp push` to the remote project environment
(will **overwrite** remote state)

## Dev Env Setup

1. Clone the repository

        git clone git@github.com/CorrelAid/metabase-to-google.git

1. Install dependencies

        npm install

1. Create clasp configuration file

        cp .clasp.json.example .clasp.json

1. Create a google apps script project [here](https://script.google.com/home)

1. Update `.clasp.json` with the fill path to the `src` folder and with a google script ID for a
   standalone script.

1. Sign into google with clasp.

        clasp login

1. Push the local project to google apps script.

        clasp push

1. Configure google apps script properties (key-value pairs).

    - `clasp open`
    - got to "Project Settings"
    - enter key-value pairs for
        - "token": <your metabase session token>
        - "url": <url of the metabase instance>

## Control sheet setup

1. Make sure the script project "metabase-to-google" is setup as described [above](#dev-env-setup).
   This means it either setup on your own account or you having access to a setup of the script project on
   another (possibly shared account).

1. In the metabase-to-google script project click on `Deploy` and then `New Deployment`.

1. Click on `Select type` and choose `Library`.

1. Enter a description and click `Deploy`.

1. Create a new Google spreadsheet file

1. Click on `Extensions` and then `Apps Script`. This opens a project tied to this Spreadsheet.

1. In the sidebar click on `Editor` and then on `+` next to `Library`. Add the script ID of the metbase-to-google
    script project. As Version you can either pick the deployment you created or pick HEAD for development purpouses.
    Not that the library usage wont work unless there is at least one deployment even if HEAD is selected.

1. Name the library for instance `metabasetogoogle`

1. Create a `init.gs` file and copy the content from below. In case your library is not named
   `metabasetogoogle` you have to make the corresponding substitutions in the snippet.

```JavaScript
function onOpen(e){
  metabasetogoogle.onOpen(e,'metabasetogoogle');
};

function libraryBackendCall(functionToCall,...args) {
   metabasetogoogle[functionToCall](args);

}
```

The setup is complete now and refreshing the Spreadsheet should create the `Metabase` custom
menu.

## Quality Assurance

Currently the following quality assurance is set up together with npm shortcuts for running
them on the source folder.

- formatter: `prettier`

        npm run format

- linter: `eslint`

        npm run lint
