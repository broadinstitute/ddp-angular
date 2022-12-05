import { APP } from 'data/constants';

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
export async function getAuth0AccessToken(app: APP): Promise<string> {
  const credentials = JSON.parse(buildAuth0ClientInfo(app));

  /*
  const options = {
    method: 'POST',
    url: `https://${credentials.domain}/oauth/token`,
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    data: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: `${credentials.client_id}`,
      client_secret: `${credentials.client_secret}`,
      audience: `${credentials.audience}`
    })
  };

  return axios
    .request(options)
    .then((response) => {
      return response.data.access_token;
    })
    .catch((err) => {
      console.error(err);
      throw err;
    });
   */

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

  /*
  const options = {
    method: 'GET',
    url: `https://${credentials.domain}/api/v2/users-by-email`,
    params: { email: userEmail },
    headers: { authorization: `Bearer ${accessToken}` }
  };

  return axios
    .request(options)
    .then((response) => {
      // console.log('response.data: ', response.data)
      return response.data[0].user_id;
    })
    .catch((err) => {
      console.error(err);
      throw err;
    });
  */

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
  accessToken: string,
  opts: { isEmailVerified?: boolean }
): Promise<string> {
  const credentials = JSON.parse(buildAuth0ClientInfo(app));
  const { isEmailVerified = true } = opts;
  const user = await getAuth0UserByEmail(app, email, accessToken);

  // console.log('user:\n', user)
  // console.log('user stringfy:\n', JSON.stringify(user))

  const userId = JSON.parse(JSON.stringify(user)).user_id;
  console.log('user_id: ', userId)

  /*
  const options = {
    method: 'PATCH',
    url: `https://${credentials.domain}/api/v2/users/${userId}`,
    headers: { Authorization: `Bearer ${accessToken}` },
    data: { email_verified: isEmailVerified }
  };

  return axios
    .request(options)
    .then((response) => {
      console.log(response.data);
    })
    .catch((err) => {
      console.error(err);
      throw err;
    });

   */

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
    .then((json) => {
      return json;
    })
    .catch((err) => {
      console.error('ERROR: PATCH /api/v2/users/$id\n', err);
      throw err;
    });
}
