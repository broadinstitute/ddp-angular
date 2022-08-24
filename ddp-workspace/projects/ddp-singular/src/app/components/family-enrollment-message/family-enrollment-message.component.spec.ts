import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilyEnrollmentMessageComponent } from './family-enrollment-message.component';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';

class TranslateLoaderMock implements TranslateLoader {
  getTranslation(code: string = ''): Observable<object> {
    const TRANSLATIONS = {
      en: {
        Title: 'A Title',
        FamilyEnrollmentMessage: {
          Content : ['content block 1', 'content block 2']
        }
      }
    };
    return of(TRANSLATIONS[code]);
  }
}

describe('FamilyEnrollmentMessageComponent', () => {
  let component: FamilyEnrollmentMessageComponent;
  let fixture: ComponentFixture<FamilyEnrollmentMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        FamilyEnrollmentMessageComponent
      ],
      imports: [
        MatIconModule,
        TranslateModule.forRoot({
          loader: {provide: TranslateLoader, useClass: TranslateLoaderMock},
        })
      ],
      providers: [
        TranslateService
      ]
    })
    .compileComponents();

    const translate = TestBed.inject(TranslateService);
    translate.use('en');
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FamilyEnrollmentMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
