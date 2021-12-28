/* eslint-disable max-classes-per-file */
import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { Observable, of } from 'rxjs';

import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { ActivityInstance, ActivityServiceAgent, LoggingService, ModalActivityBlockComponent } from 'ddp-sdk';
import { ModalDialogService } from '../../../../services/modal-dialog.service';
import { MatIconModule } from '@angular/material/icon';

describe('ModalActivityBlockComponent', () => {
  @Component({
    template: `
        <ddp-modal-activity-block [instance]="instance">
        </ddp-modal-activity-block>`
  })
  class TestHostComponent {
    instance;
  }

  class TranslateLoaderMock implements TranslateLoader {
    getTranslation(code: string = ''): Observable<object> {
      const TRANSLATIONS = {
        en: {
          SDK : {
            ModalActivityBlock: {
              NumQuestionsAnswered: '{{number}} questions answered test',
              Complete: 'CompleteTest',
            },
          }
        }
      };
      return of(TRANSLATIONS[code]);
    }
  }

  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let debugElement: DebugElement;

  const successMessageSelector = '.modal-activity-block__success-message';
  const successMessageIconSelector = `${successMessageSelector} mat-icon`;
  const successMessageLabelSelector = '.modal-activity-block__label';

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalActivityBlockComponent, TestHostComponent],
      providers: [
        { provide: ActivityServiceAgent, useValue: {} },
        { provide: MatDialog, useValue: {} },
        { provide: LoggingService, useValue: {} },
        { provide: ModalDialogService, useValue: {} }
      ],
      imports: [
        MatCardModule,
        MatIconModule,
        TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateLoaderMock }}),
      ]
    }).compileComponents();

    const translate = TestBed.inject(TranslateService);
    translate.use('en');

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    component.instance = {
      statusCode: 'IN_PROGRESS',
      numQuestionsAnswered: 5,
      numQuestions: 7,
    } as ActivityInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should hide the status label if statusCode is `CREATED`', () => {
    const successMessage = fixture.debugElement.query(By.css(`${successMessageSelector} .mat-icon`));
    expect(successMessage).toBeFalsy();
  });

  it('should hide the icon and show the amount of answered questions if not all questions were answered', () => {
    const icon = fixture.debugElement.query(By.css(successMessageIconSelector));
    const label = fixture.debugElement.query(By.css(successMessageLabelSelector))
      .nativeElement.textContent.trim();
    expect(icon).toBeFalsy();
    expect(label).toBe('5 questions answered test');
  });

  it('should show the icon and Complete label if all questions were answered', () => {
    component.instance = {
      statusCode: 'IN_PROGRESS',
      numQuestionsAnswered: 7,
      numQuestions: 7,
    } as ActivityInstance;
    fixture.detectChanges();

    const icon = fixture.debugElement.query(By.css(successMessageIconSelector));
    const label = fixture.debugElement.query(By.css(successMessageLabelSelector))
      .nativeElement.textContent.trim();
    expect(icon).toBeTruthy();
    expect(label).toBe('CompleteTest');
  });
});
