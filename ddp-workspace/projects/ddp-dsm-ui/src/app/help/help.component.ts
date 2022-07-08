import {Component, OnDestroy, OnInit} from '@angular/core';
import { Auth } from '../services/auth.service';
import {Observable, Subject} from 'rxjs';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: []
})
export class ExportHelpComponent implements OnInit, OnDestroy {
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
