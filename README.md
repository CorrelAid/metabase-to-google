# Metabase API & Google Apps Script: Live-Connected Data Flow Metabase -> Google Sheets

## What is this project about?

This project connects Metabase and Google Spreadsheets. It explores
automated approaches to (pre-)curating Google Spreadsheets from a set of Metabase dashboards and
saved Metabase queries (called cards in Metabase) through the
[ℹ️ Metabase API](https://www.metabase.com/docs/latest/api-documentation),
[ℹ️ Google Apps Script](https://developers.google.com/apps-script), and various Google APIs
(e.g. [ℹ️ Sheets API](https://developers.google.com/sheets/api)).

The goal is to make it easy to keep the exported Metabase data in the spreadsheets up date.
Currently this is done by making updates very easy, but in the future it might even be automated entirely ('live-connected').

## This Repository

This repository contains JavaScript code that is intended to be deployed as a Google Apps script library, which in turn should be used in a containerized script of a Google SpreadSheet. Detailed setup instructions are found [below](#control-sheet-setup).

After the setup, the library proved the additional `Metabase` menu in the SpreadSheet, which can be used to access data from Metabase and interactively create additional SpreadSheets with data from Metabase queries.

## Dev Env Setup

1.  Clone the repository

        git clone git@github.com/CorrelAid/metabase-to-google.git

1.  Install dependencies

        npm install

1.  Create clasp configuration file

        cp .clasp.json.example .clasp.json

1.  Create a google apps script project [here](https://script.google.com/home). **NOTE**: You have to [enable Google Apps Script for your user](https://script.google.com/home/usersettings) if you haven't done it already.

1.  Update `.clasp.json` with the fill path to the `src` folder and with a google script ID for a
    standalone script.

1.  Sign into google with clasp.

        clasp login

1.  Push the local project to google apps script.

        clasp push

1.  Configure google apps script properties (key-value pairs).

    - `clasp open`
    - got to "Project Settings"
    - enter key-value pairs for
      - "token": <your metabase session token>
      - "url": <url of the metabase instance>

### Pre-commit setup

There is a pre-commit hook setup included which can optionally be installed in the development
environment. This is done by running.

        npm run init_pre_commit

This setup uses `husky` to run formatting and linting (see [below](#quality-assurance)) on each
commit automatically. It is recommended to make use of this in particular, because part of the
CI is checking the same things.

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

- unit testing: `jasmine`

        npm run test

All three quality assurance tools together for our CI checks. This means CI should pass if
these three checks pass locally. Additionally formatting and linting are part of the pre-commit hook
setup (see [above](#pre-commit-setup)).
