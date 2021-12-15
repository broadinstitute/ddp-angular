import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SlicePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatExpansionPanelHarness } from '@angular/material/expansion/testing';
import { Observable, of } from 'rxjs';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';

import { FaqSectionComponent } from '../faq-section/faq-section.component';
import { FaqComponent } from './faq.component';
import { CommunicationService } from 'toolkit';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';

class TranslateLoaderMock implements TranslateLoader {
    getTranslation(code: string = ''): Observable<object> {
        const TRANSLATIONS = {
            en: {
                App: {
                    FAQ: {
                        Title: 'Frequently Asked Questions',
                        Button: {
                            Expand: 'Expand all',
                            Collapse: 'Collapse all',
                            MoreFAQs: 'More FAQs'
                        },
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
                            }
                        ]
                    }
                }
            }
        };
        return of(TRANSLATIONS[code]);
    }
}

describe('FaqComponent', () => {
    let component: FaqComponent;
    let fixture: ComponentFixture<FaqComponent>;
    let loader: HarnessLoader;
    let dialogSpy: jasmine.SpyObj<MatDialog>;
    let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;

    beforeEach(async () => {
        dialogSpy = jasmine.createSpyObj('dialogSpy', ['open']);
        activatedRouteSpy = jasmine.createSpyObj('activatedRouteSpy', ['snapshot']);
        await TestBed.configureTestingModule({
            declarations: [
                FaqComponent,
                FaqSectionComponent,
                SlicePipe
            ],
            imports: [
                MatIconModule,
                MatExpansionModule,
                NoopAnimationsModule,
                MatDialogModule,
                TranslateModule.forRoot({
                    loader: {provide: TranslateLoader, useClass: TranslateLoaderMock},
                }),
            ],
            providers: [
                { provide: CommunicationService, useValue: {} },
                { provide: MatDialog, useValue: dialogSpy},
                { provide: 'toolkit.toolkitConfig', useValue: {} },
                { provide: ActivatedRoute, useValue: activatedRouteSpy}
            ],
        })
            .compileComponents();

        const translate = TestBed.inject(TranslateService);
        translate.use('en');
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(FaqComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        loader = TestbedHarnessEnvironment.loader(fixture);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should include 2 question panels', async () => {
        const panels = await loader.getAllHarnesses(MatExpansionPanelHarness);
        expect(panels.length).toBe(2);
    });

    it('should keep all questions collapsed by default', async () => {
        const panels = await loader.getAllHarnesses(MatExpansionPanelHarness);
        expect(await panels[0].isExpanded()).toBeFalse();
        expect(await panels[1].isExpanded()).toBeFalse();
    });

    it('should expand all questions by click on `Expand All` button', async () => {
        const panels = await loader.getAllHarnesses(MatExpansionPanelHarness);
        const expandBtn = fixture.debugElement.query(By.css('.expand-btn')).nativeElement;
        expect(expandBtn.textContent).toContain('Expand all');

        expandBtn.click();
        expect(component.isAllOpened).toBeTrue();
        expect(await panels[0].isExpanded()).toBeTrue();
        expect(await panels[1].isExpanded()).toBeTrue();
    });

    it('should collapse all questions by click on `collapse All` button', async () => {
        component.isAllOpened = true;
        fixture.detectChanges();

        const panels = await loader.getAllHarnesses(MatExpansionPanelHarness);
        const expandBtn = fixture.debugElement.query(By.css('.expand-btn')).nativeElement;
        expect(expandBtn.textContent).toContain('Collapse all');

        expandBtn.click();
        expect(component.isAllOpened).toBeFalse();
        expect(await panels[0].isExpanded()).toBeFalse();
        expect(await panels[1].isExpanded()).toBeFalse();
    });
});
