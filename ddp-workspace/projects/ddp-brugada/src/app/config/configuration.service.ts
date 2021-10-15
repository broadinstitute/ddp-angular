import { ConfigurationService as SDKConfigurationService } from 'ddp-sdk';

export class ConfigurationService extends SDKConfigurationService {
  /**
   * The name of the database configured to your client.
   */
  dbName: string;
}
