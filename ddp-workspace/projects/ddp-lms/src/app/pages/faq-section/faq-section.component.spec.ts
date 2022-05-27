import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Observable, of } from 'rxjs';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';

import { FaqSectionComponent } from './faq-section.component';

class TranslateLoaderMock implements TranslateLoader {
  getTranslation(code: string = ''): Observable<object> {
    const TRANSLATIONS = {
      en: {
        App: {
          FAQ: {
            Button: {
              Collapse: 'Collapse',
              Expand: 'Expand'
            }
          }
        }
      }
    };
    return of(TRANSLATIONS[code]);
  }
}

describe('FaqSectionComponent', () => {
  let component: FaqSectionComponent;
  let fixture: ComponentFixture<FaqSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
        imports: [
          MatIconModule,
          MatExpansionModule,
          MatDividerModule,
          NoopAnimationsModule,
          TranslateModule.forRoot({
            loader: {provide: TranslateLoader, useClass: TranslateLoaderMock},
          }),
        ],
        declarations: [ FaqSectionComponent ]
    })
    .compileComponents();

    const translate = TestBed.inject(TranslateService);
    translate.use('en');
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FaqSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
