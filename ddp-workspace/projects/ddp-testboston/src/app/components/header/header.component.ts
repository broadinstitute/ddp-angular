import { Component } from '@angular/core';
import { SessionMementoService } from 'ddp-sdk';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  constructor(
    private session: SessionMementoService) { }

  public get isAuthenticated(): boolean {
    return this.session.isAuthenticatedSession();
  }
}
