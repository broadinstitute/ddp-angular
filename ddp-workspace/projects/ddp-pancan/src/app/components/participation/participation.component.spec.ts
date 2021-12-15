import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { Observable, of } from 'rxjs';

import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { ParticipationComponent } from './participation.component';


class TranslateLoaderMock implements TranslateLoader {
    getTranslation(code= ''): Observable<object> {
        const TRANSLATIONS = {
            en: {
                App: {
                    ParticipationPage: {
                        Title: 'Here’s how to participate',
                        Steps: [
                            {
                                Title: 'STEP 1',
                                Time: '10-15 minutes',
                                Description: 'Provide consent and tell us where you’ve been treated',
                                ImageAlt: 'Computer screen displaying online consent form'
                            },
                            {
                                Title: 'STEP 2',
                                Time: '5 minutes',
                                Description: 'Answer questions about your cancer',
                                ImageAlt: 'Computer screen displaying online survey'
                            }
                        ]
                    }
                }
            }
        };
        return of(TRANSLATIONS[code]);
    }
}

describe('ParticipationComponent', () => {
    let component: ParticipationComponent;
    let fixture: ComponentFixture<ParticipationComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
                imports: [
                    MatIconModule,
                    TranslateModule.forRoot(
                        {loader: { provide: TranslateLoader, useClass: TranslateLoaderMock }
                    })
                ],

                declarations: [ParticipationComponent]
            })
            .compileComponents();

        const translate = TestBed.inject(TranslateService);
        translate.use('en');
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ParticipationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
