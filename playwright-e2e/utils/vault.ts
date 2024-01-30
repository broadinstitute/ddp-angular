import vault from 'node-vault';

const client = vault({
  apiVersion: 'v1',
  endpoint: process.env.VAULT_ADDR,
});

const GITHUB_TOKEN = process.env.VAULT_TOKEN;

const data = async () => {
  try {
    const login = await client.githubLogin({ token: GITHUB_TOKEN });
    client.token = login.auth.client_token;
    const { data } = await client.read('secret/pepper/test/v1/e2e');

    const users = data.users;
    users.forEach((key: any, value: any) => {
      if (key.app === 'dsm') {
        console.log('dsm');
      }
    })
    // console.log(data.users);
    return data;
  } catch (error) {
    console.error(error);
  }
  return null;
};

export { client as vault, data };
