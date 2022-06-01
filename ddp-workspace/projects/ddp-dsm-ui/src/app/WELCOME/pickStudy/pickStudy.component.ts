import {Component, Input, OnDestroy, OnInit} from '@angular/core';
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
          <mat-option *ngFor="let realm of realms" [value]="{name: realm.name, value: realm.value}">{{ realm.value }}</mat-option>
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
  @Input('pickList') realms: Array<NameValue>;
  pickedStudy = new FormControl('');
  unsubscribeVar = new Subject();

  constructor(private auth: Auth, private router: Router, private title: Title) {
  }

  ngOnInit(): void {
    this.title.setTitle('Select study');

    this.pickedStudy.valueChanges
      .pipe(takeUntil(this.unsubscribeVar))
      .subscribe(({name, value}) => {
        this.router.navigate([name]);
        localStorage.setItem(ComponentService.MENU_SELECTED_REALM, name);
        this.auth.setSelectedStudy = value;
      });
  }

  ngOnDestroy(): void {
    this.unsubscribeVar.next(null);
  }
}
