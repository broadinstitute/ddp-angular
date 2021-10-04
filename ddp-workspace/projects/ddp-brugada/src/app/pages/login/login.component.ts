import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  showResetBar$: Observable<boolean>;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.showResetBar$ = this.route.queryParams.pipe(map((params: Params) => params.reset_password));
  }
}
