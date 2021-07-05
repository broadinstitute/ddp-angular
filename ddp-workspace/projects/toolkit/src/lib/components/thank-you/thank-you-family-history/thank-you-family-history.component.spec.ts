import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThankYouFamilyHistoryComponent } from 'toolkit';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

class TranslateLoaderMock implements TranslateLoader {
  getTranslation(code: string = ''): Observable<object> {
    const TRANSLATIONS = {
      en: {}
    };
    return of(TRANSLATIONS[code]);
  }
}

describe('ThankYouFamilyHistoryComponent', () => {
  let component: ThankYouFamilyHistoryComponent;
  let fixture: ComponentFixture<ThankYouFamilyHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateLoaderMock }, }),
      ],
      declarations: [ ThankYouFamilyHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThankYouFamilyHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
