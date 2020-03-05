#!/usr/bin/env node
const {auth} = require('google-auth-library');
const fs = require("fs");


function readCredentialsFromStdIn() {
    const keyDataString = fs.readFileSync(0, "utf-8");
    return JSON.parse(keyDataString);
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

    const data = {
        "range": "Sheet1!A1:B1",
        "majorDimension": "ROWS",
        "values": [rowValues]
    };

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A1:B1:append?valueInputOption=USER_ENTERED`;
    const callback = (error, response) => {
        if (error) {
            console.error('The following error was reported:\n %o', error);
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
        } else {
            console.log("%o", response.data);
        }
    };
    client.request({method: 'POST', url, data}, callback);
}

 main().catch(console.error);
