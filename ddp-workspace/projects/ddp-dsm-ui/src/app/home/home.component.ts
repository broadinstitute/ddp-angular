import {Component, OnDestroy, OnInit} from '@angular/core';
import { Auth } from '../services/auth.service';
import {ActivatedRoute} from '@angular/router';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit, OnDestroy {
  notAllowedToLogin = false;
  selectedRealm: string;
  destroy = new Subject();

  constructor(public auth: Auth, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.auth.events.pipe(takeUntil(this.destroy)).subscribe(e => e === Auth.AUTHENTICATION_ERROR && (this.notAllowedToLogin = true));

    this.route.params.subscribe(param => this.selectedRealm = param.study);
  }

  ngOnDestroy(): void {
    this.destroy.next(null);
  }

}
