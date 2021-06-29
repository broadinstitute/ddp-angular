import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { AnchorsPageComponent } from './anchors-page.component';

class TranslateLoaderMock implements TranslateLoader {
    getTranslation(code: string = ''): Observable<object> {
        const TRANSLATIONS = {
            en: {
                App: {
                  AboutUs: {
                      Title: 'About Us',
                      Sections: [
                          {
                              Title: 'Mission',
                              Paragraphs: [
                                  'Count Me In is a nonprofit organization.',
                                  'Participating patients help shape and propel research.'
                              ]
                          }
                      ]
                  }
                }
            }
        };
        return of(TRANSLATIONS[code]);
    }
}

describe('AnchorsPageComponent', () => {
  let component: AnchorsPageComponent;
  let fixture: ComponentFixture<AnchorsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnchorsPageComponent ],
        imports: [
            TranslateModule.forRoot({
                loader: {provide: TranslateLoader, useClass: TranslateLoaderMock},
            })
        ]
    })
    .compileComponents();

      const translate = TestBed.inject(TranslateService);
      translate.use('en');
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnchorsPageComponent);
    component = fixture.componentInstance;
    component.source = 'App.AboutUs';
    component.route = 'about-us';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
