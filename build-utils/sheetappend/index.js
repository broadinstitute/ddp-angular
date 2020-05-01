#!/usr/bin/env node
const {auth} = require('google-auth-library');
const fs = require("fs");


function readCredentialsFromStdIn() {
    const keyDataString = fs.readFileSync(0, "utf-8");
    return JSON.parse(keyDataString);
}

function buildAppendRowDataRequest(spreadsheetId, rowValues) {
    const data = {
        "range": "Sheet1!A1",
        "majorDimension": "ROWS",
        "values": [rowValues]
    };

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A1:append?valueInputOption=USER_ENTERED&insertDataOption=OVERWRITE`;
    return {method: 'POST', url, data};
}

function buildInsertRowBelowHeaderRequest(spreadsheetId) {
     const data = {
        "requests": [
            {
                "insertDimension": {
                    "range": {
                        "sheetId": 0,
                        "dimension": "ROWS",
                        "startIndex": 1,
                        "endIndex": 2
                    },
                    "inheritFromBefore": false
                }
            }
        ],
    };
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`;
    return {method: 'POST', url, data};
}

async function main() {
    const args = process.argv.slice(2);
    if (args < 2) {
        console.error('USAGE: sheetappend spreadsheet_id val1 [val2 val3 ...]');
        console.log('where:\n    spreadsheet_id is the Google Sheet Id for spreadsheet to update');
        console.log('    val1, val2 are values to be included in a row that will be appended to spreadsheet');
        console.log('Google account credentials in JSON format are expected to be piped in via stdin');
        process.exit(1);
    }

    console.warn('Reading credentials from stdin...');
    let keys;
    try {
        keys = readCredentialsFromStdIn();
    } catch(error) {
        console.error('There was a problem reading Google credentials from stdin:\n %o', error);
        process.exit(1);
    }

    const spreadsheetId = args[0];
    let rowValues = args.slice(1);

    const client = auth.fromJSON(keys);
    client.scopes = ['https://www.googleapis.com/auth/spreadsheets'];

    const handleResponse = (response) => {
        if (response.status === 200) {
            console.log("%o", response.data);
        } else {
            console.error('There was an error:\n %o', response);
            if (response) {
                if(response.status === 404) {
                    console.error('Could not find Google sheet with id: %s', spreadsheetId);
                }
                if(response.status === 403) {
                    console.error('Access was not allowed to Google Sheet %s. Ensure permission granted to access the specify sheet to client_email specified in credentials', spreadsheetId);
                } else {
                    console.error('The response from the server:\n %o', response);
                }
            }
            process.exit(1);
        }
    };

    let response = await client.request(buildInsertRowBelowHeaderRequest(spreadsheetId));
    handleResponse(response);
    response = await client.request(buildAppendRowDataRequest(spreadsheetId, rowValues));
    handleResponse(response);
}

 main().catch(console.error);
