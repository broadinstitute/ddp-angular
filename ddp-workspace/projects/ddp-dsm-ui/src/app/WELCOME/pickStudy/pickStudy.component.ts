import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Auth} from '../../services/auth.service';
import {NameValue} from '../../utils/name-value.model';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {Router} from '@angular/router';
import {ComponentService} from '../../services/component.service';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-pick-study',
  template: `
    <div class="container">
      <mat-form-field appearance="fill">
        <mat-label>Select study</mat-label>
        <mat-select [formControl]="pickedStudy">
          <mat-option *ngFor="let realm of realms" [value]="realm.name">{{ realm.value }}</mat-option>
        </mat-select>
      </mat-form-field>
    </div>
  `,
  styles: [`
    .container {
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `]
})

export class PickStudyComponent implements OnInit, OnDestroy {
  realms: Array<NameValue>;
  pickedStudy = new FormControl('');
  unsubscribeVar = new Subject();

  constructor(private auth: Auth, private router: Router, private title: Title) {
  }

  ngOnInit(): void {
    this.realms = this.auth.realmList;

    this.title.setTitle('Select study');

    this.pickedStudy.valueChanges
      .pipe(takeUntil(this.unsubscribeVar))
      .subscribe(realm => {
        this.router.navigate([realm]);
        localStorage.setItem(ComponentService.MENU_SELECTED_REALM, realm);
      });
  }

  ngOnDestroy(): void {
    this.unsubscribeVar.next(null);
  }
}
