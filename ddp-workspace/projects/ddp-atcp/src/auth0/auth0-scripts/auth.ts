declare const auth0;

export const createAuth0 = config => {
  if (Array.isArray(config)) {
    return new auth0.WebAuth({
      domain: config[0],
      clientID: config[1],
      responseType: 'token id_token',
    });
  }
  return new auth0.WebAuth({
    domain: config.auth0Domain,
    clientID: config.clientID,
    redirectUri: config.callbackURL,
    responseType: config.internalOptions.response_type,
    params: config.internalOptions,
    configurationBaseUrl: config.clientConfigurationBaseUrl,
  });
};
