#!/usr/bin/env node
const {auth} = require('google-auth-library');
const fs = require("fs");


function readCredentialsFromStdIn() {
    const keyDataString = fs.readFileSync(0, "utf-8");
    return JSON.parse(keyDataString);
}
function readRowValues(rawArrayString) {
    try {
        rowValues = JSON.parse(rawArrayString);
    } catch(error) {
        console.error('Unable to JSON.parse second argument with values for row: %o', error);
        process.exit(1);
    }

    if (!Array.isArray(rowValues)) {
        console.error('Was expecting an array as row input value');
        process.exit(1);
    }
    return rowValues;
}


async function main() {
    const args = process.argv.slice(2);
    if (args.length < 2) {
        console.error('USAGE: sheetappend spreadsheet_id data_row');
        console.log('where:\n    spreadsheet_id is the Google Sheet Id for spreadsheet to update')
        console.log('    data_row is a JSON string (e.g. ["foo", "bar"] ) that resolves to an array that contains values to add to last row of spreadsheet')
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
    let rowValues = readRowValues(args[1]);

    const client = auth.fromJSON(keys);
    client.scopes = ['https://www.googleapis.com/auth/spreadsheets'];

    const data = {
        "range": "Sheet1!A1:B1",
        "majorDimension": "ROWS",
        "values": [rowValues]
    };

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A1:B1:append?valueInputOption=USER_ENTERED`
    const callback = (error, response) => {
        if (error) {
            console.error('The following error was reported:\n %o', error);
            if (response) {
                if(response.status == 404) {
                    console.error('Could not find Google sheet with id: %s', spreadsheetId);
                }
                if(response.status == 403) {
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
