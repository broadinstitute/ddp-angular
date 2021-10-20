import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  readonly defaultLanguageCode = 'en';

  constructor() { }
}
