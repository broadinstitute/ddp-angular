import {Component, OnDestroy, OnInit} from '@angular/core';
import { Auth } from '../services/auth.service';
import {Observable, Subject} from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  selectedRealm: Observable<string>;
  destroy = new Subject();

  constructor(public auth: Auth) {}

  ngOnInit(): void {
    this.selectedRealm = this.auth.getSelectedStudy();
  }


  ngOnDestroy(): void {
    this.destroy.next(null);
  }

}
