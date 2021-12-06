import { Component, OnInit } from '@angular/core';
import { Auth0AdapterService } from 'ddp-sdk';


@Component({
  selector: 'app-redirect-to-login',
  templateUrl: './redirect-to-login.component.html',
  styleUrls: ['./redirect-to-login.component.scss'],
})
export class RedirectToLoginComponent implements OnInit {
  constructor(private auth0: Auth0AdapterService) {}

  ngOnInit(): void {
    this.redirectToLogin();
  }

  private redirectToLogin(): void {
    this.auth0.login();
  }
}
