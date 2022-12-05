import axios from 'axios';
import { APP } from 'data/constants';

function buildClientInfo(app: APP): string {
  let clientId;
  let clientSecret;
  let audience;
  let domain;

  switch (app) {
    case 'RGP':
      clientId = process.env.RGP_CLIENT_ID;
      clientSecret = process.env.RGP_CLIENT_SECRET;
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
export async function getAccessToken(app: APP): Promise<string> {
  const credentials = JSON.parse(buildClientInfo(app));

  const options = {
    method: 'POST',
    url: `https://${credentials.domain}/oauth/token`,
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    data: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: `${credentials.client_id}`,
      client_secret: `${credentials.clients_secret}`,
      audience: `${credentials.audience}`
    })
  };

  return axios
    .request(options)
    .then((response) => {
      const keys = JSON.parse(response.data);
      return keys.access_token;
    })
    .catch((err) => {
      console.error(err);
      throw err;
    });
}

/**
 * Get user_id by email
 * @param {APP} app
 * @param {string} userEmail
 * @param {string} accessToken
 * @returns {Promise<string>}
 */
export async function getUserID(app: APP, userEmail: string, accessToken: string): Promise<string> {
  const credentials = JSON.parse(buildClientInfo(app));

  const options = {
    method: 'GET',
    url: `https://${credentials.domain}/api/v2/users-by-email`,
    params: { email: userEmail },
    headers: { authorization: `Bearer ${accessToken}` }
  };

  return axios
    .request(options)
    .then((response) => {
      const data = JSON.parse(response.data);
      console.log(data);
      return data.identities[0].user_id;
    })
    .catch((err) => {
      console.error(err);
      throw err;
    });
}
