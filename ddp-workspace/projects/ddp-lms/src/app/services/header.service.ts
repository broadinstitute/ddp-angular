import { Injectable } from '@angular/core';
import { HeaderConfigurationService } from 'toolkit';

@Injectable({
  providedIn: 'root',
})
export class HeaderService extends HeaderConfigurationService {
  constructor() {
    super();}

  setupPasswordHeader() {
    this.showLoginButton = false;
    this.setupDefaultHeader();
  }
}
