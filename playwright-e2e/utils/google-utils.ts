// from https://developers.google.com/people/quickstart/nodejs

import { authenticate } from '@google-cloud/local-auth';
import { google } from 'googleapis';
import path from 'path';
import { promises as fsPromises } from 'fs';
import { OAuth2Client } from 'google-auth-library';

// Stores google email access token for targeted app.
// Created automatically when the authorization flow completes for the first time.
const TOKEN_PATH = path.join(process.cwd(), 'google-email-token.txt');
const CREDENTIALS_PATH = path.join(process.cwd(), 'google-email-credentials.txt');

const SCOPES = ['https://www.googleapis.com/auth/contacts.readonly'];

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fsPromises.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content.toString());
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file comptible with GoogleAUth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client: OAuth2Client) {
  const content = await fsPromises.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content.toString());
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token
  });
  await fsPromises.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */
export async function authorize() {
  const cachedClient = await loadSavedCredentialsIfExist();
  if (cachedClient) {
    return cachedClient;
  }
  const newClient = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH
  });
  if (newClient.credentials) {
    await saveCredentials(newClient);
  }
  return newClient;
}

/**
 * Print the display name if available for 10 connections.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
async function listConnectionNames(auth: any) {
  const service = google.people({ version: 'v1', auth });
  const res = await service.people.connections.list({
    resourceName: 'people/me',
    pageSize: 10,
    personFields: 'names,emailAddresses'
  });
  const connections = res.data.connections;
  if (!connections || connections.length === 0) {
    console.log('No connections found.');
    return;
  }
  console.log('Connections:');
  connections.forEach((person) => {
    if (person.names && person.names.length > 0) {
      console.log(person.names[0].displayName);
    } else {
      console.log('No display name found for connection.');
    }
  });
}

authorize().then(listConnectionNames).catch(console.error);
