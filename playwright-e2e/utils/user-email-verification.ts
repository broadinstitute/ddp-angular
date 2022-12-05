import axios from 'axios';

const { RGP_AUTH0_DOMAIN, RGP_CLIENT_ID, RGP_CLIENT_SECRET, RGP_AUTH0_AUDIENCE } = process.env;

// https://auth0.com/docs/secure/tokens/access-tokens/get-access-tokens
export async function getAccessToken(): Promise<void> {
  const options = {
    method: 'POST',
    url: `https://${RGP_AUTH0_DOMAIN}/oauth/token`,
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    data: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: `${RGP_CLIENT_ID}`,
      client_secret: `${RGP_CLIENT_SECRET}`,
      audience: `${RGP_AUTH0_AUDIENCE}`
    })
  };

  await axios
    .request(options)
    .then((response) => {
      console.log(JSON.parse(response.data));
      return response.data.access_token;
    })
    .catch((error) => {
      console.error(error);
    });
}

export async function getUserID(userEmail: string, accessToken: string): Promise<string> {
  const options = {
    method: 'GET',
    url: `https://${RGP_AUTH0_DOMAIN}/api/v2/users-by-email`,
    params: { email: userEmail },
    headers: { authorization: `Bearer ${accessToken}` }
  };
  await axios
    .request(options)
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.error(error);
    });
  return 'null';
}
