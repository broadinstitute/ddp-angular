import { promises as fsPromises } from 'fs';
import path from 'path';
import { APP } from 'data/constants';

// Stores AUTH0 access token for targeted app.
// Created automatically when the authorization flow completes for the first time.
const getTokenPath = (app: APP) => path.join(process.cwd(), app, 'token.txt');

/**
 * Reads previously authorized credentials from the save file.
 */
async function loadSavedAccessTokenIfExist(app: APP): Promise<string | null> {
  try {
    const contents = await fsPromises.readFile(getTokenPath(app), { encoding: 'utf-8' });
    console.log(`read stored ${app} access_token:\n`, contents.toString());
    return contents.toString();
  } catch (err) {
    return null;
  }
}

/**
 * Build Auth0 client credentials
 * @param {APP} app
 * @returns {string} JSON
 */
function buildAuth0ClientInfo(app: APP): string {
  let clientId;
  let clientSecret;
  let audience;
  let domain;

  switch (app) {
    case 'RGP':
      clientId = process.env.RGP_AUTH0_CLIENT_ID;
      clientSecret = process.env.RGP_AUTH0_CLIENT_SECRET;
      audience = process.env.RGP_AUTH0_AUDIENCE;
      domain = process.env.RGP_AUTH0_DOMAIN;
      break;
    default:
      throw Error(`Undefined app name: ${app}`);
  }

  return JSON.stringify({
    client_id: clientId,
    client_secret: clientSecret,
    audience,
    domain
  });
}

/**
 * Get access token by client secrets
 * See https://auth0.com/docs/secure/tokens/access-tokens/get-access-tokens
 * @param {APP} app
 * @returns {Promise<void>}
 */
export async function getAuth0AccessToken(app: APP): Promise<string> {
  const savedAccessToken = await loadSavedAccessTokenIfExist(app);
  if (savedAccessToken) {
    return savedAccessToken;
  }

  const credentials = JSON.parse(buildAuth0ClientInfo(app));

  return fetch(`https://${credentials.domain}/oauth/token`, {
    method: 'POST',
    headers: { 'content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: `${credentials.client_id}`,
      client_secret: `${credentials.client_secret}`,
      audience: `${credentials.audience}`
    })
  })
    .then((res) => res.json())
    .then((json) => {
      return json.access_token;
    })
    .catch((err) => {
      console.error(err);
      throw err;
    });
}

/**
 * Get user_id by email
 * @param {APP} app
 * @param email
 * @param accessToken
 * @returns {Promise<string>}
 */
export async function getAuth0UserByEmail(app: APP, email: string, accessToken: string): Promise<string> {
  const credentials = JSON.parse(buildAuth0ClientInfo(app));

  return fetch(`https://${credentials.domain}/api/v2/users-by-email?${new URLSearchParams({ email })}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${accessToken}` }
  })
    .then(async (res) => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(JSON.stringify(await res.json()));
    })
    .then((json) => {
      // return json[0].user_id;
      return json[0];
    })
    .catch((err) => {
      console.error('\nERROR in getAuth0UserId(): ', err);
      throw err;
    });
}

export async function setAuth0UserEmailVerified(
  app: APP,
  email: string,
  opts: { isEmailVerified?: boolean; accessToken?: string }
): Promise<string> {
  const credentials = JSON.parse(buildAuth0ClientInfo(app));
  const { isEmailVerified = true, accessToken = await getAuth0AccessToken(app) } = opts;
  const user = await getAuth0UserByEmail(app, email, accessToken);

  const userId = JSON.parse(JSON.stringify(user)).user_id;

  return fetch(`https://${credentials.domain}/api/v2/users/${userId}`, {
    method: 'PATCH',
    headers: { authorization: `Bearer ${accessToken}`, 'Content-type': 'application/json; charset=UTF-8' },
    body: JSON.stringify({ email_verified: isEmailVerified })
  })
    .then(async (res) => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(JSON.stringify(await res.json()));
    })
    .catch((err) => {
      console.error(`ERROR: PATCH /api/v2/users/${userId}\n`, err);
      throw err;
    });
}
