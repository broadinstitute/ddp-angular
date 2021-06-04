import { ConfigurationService } from 'ddp-sdk';
import { LanguageHostName } from './languageHostName';

/**
 * Need a couple of Configuration extra-properties
 */
export class MbcConfigurationService extends ConfigurationService {
  languageHostNames: LanguageHostName[] = [];
  baseHostName: string;
}
