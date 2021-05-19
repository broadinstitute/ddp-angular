import { Injectable } from '@angular/core';
import { ConfigurationService } from 'ddp-sdk';
import { LanguageHostName } from './languageHostName';

export class MbcConfigurationService extends ConfigurationService {
  languageHostNames: LanguageHostName[] = [];
  baseHostName: string;

}
