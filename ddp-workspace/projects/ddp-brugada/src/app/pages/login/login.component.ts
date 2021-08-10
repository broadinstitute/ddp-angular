import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  showResetBar = false;

  constructor(
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      this.showResetBar = !!params.reset_password;
    });
  }
}
