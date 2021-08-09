import { ConfigurationService as SDKConfigurationService } from 'ddp-sdk';
// import { DdpModule, ConfigurationService, LoggingService, LanguageService } from 'ddp-sdk';



export class ConfigurationService extends SDKConfigurationService {
  /**
   * Using scopes can allow you to return specific claims for specific fields in your request.
   */
  auth0Scope: string;

  /**
   * It can be any space separated list of the values code, token, id_token
   */
  auth0ResponseType: string;

  /**
   * The name of the database configured to your client.
   */
  dbName: string;
}
