import { Injectable } from '@angular/core';
import { HeaderConfigurationService } from 'toolkit';

@Injectable({
  providedIn: 'root',
})
export class HeaderService extends HeaderConfigurationService {
  constructor() {
    super();}

  public setupPasswordHeader(): void {
    this.showLoginButton = false;
    this.setupDefaultHeader();
  }
}
