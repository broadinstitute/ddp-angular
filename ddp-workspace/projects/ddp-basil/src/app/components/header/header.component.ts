import { Component, OnInit } from '@angular/core';
import { SessionMementoService } from 'ddp-sdk';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private session: SessionMementoService) { }

  ngOnInit(): void {
  }

  public get isAuthenticated(): boolean {
      return this.session.isAuthenticatedSession();
  }
}
