import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SlicePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
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
                        Questions: [
                            {
                                Question: 'Question1',
                                Paragraphs: [
                                    'Paragraph1'
                                ]
                            },
                            {
                                Question: 'Question2',
                                Paragraphs: [
                                    'Paragraph2'
                                ]
                            },
                            {
                                Question: 'Question3',
                                Paragraphs: [
                                    'Paragraph1'
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

describe('FaqItemComponent', () => {
    let component: FaqSectionComponent;
    let fixture: ComponentFixture<FaqSectionComponent>;

    beforeEach(async() => {
        await TestBed.configureTestingModule({
                declarations: [
                    FaqSectionComponent,
                    SlicePipe
                ],
                imports: [
                    MatIconModule,
                    MatExpansionModule,
                    NoopAnimationsModule,
                    TranslateModule.forRoot({
                        loader: {provide: TranslateLoader, useClass: TranslateLoaderMock},
                    }),
                ]
            })
            .compileComponents();

        const translate = TestBed.inject(TranslateService);
        translate.use('en');
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(FaqSectionComponent);
        component = fixture.componentInstance;
        component.questions = `App.FAQ.Questions`;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should display all questions if no questionsCount', () => {
        const questionPanels = fixture.debugElement.queryAll(By.css('.faq-block__question'));
        expect(questionPanels.length).toBe(3);
    });

    it('should display limited amount of questions if there is `questionsCount` input parameter ', () => {
        component.questionsCount = 1;
        fixture.detectChanges();
        const questionPanels = fixture.debugElement.queryAll(By.css('.faq-block__question'));
        expect(questionPanels.length).toBe(1);
    });
});
