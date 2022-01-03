import { Component, DebugElement, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatStepperModule } from '@angular/material/stepper';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { ProgressIndicatorComponent } from './progress-indicator.component';

const ACTIVE_STEP_LABEL_SELECTOR = '.mat-vertical-stepper-header[aria-selected="true"] .mat-step-text-label';
const ACTIVE_STEP_CONTENT_SELECTOR = '.mat-vertical-stepper-content[aria-expanded="true"] .page';

class TranslateLoaderMock implements TranslateLoader {
    getTranslation(code: string = ''): Observable<object> {
        const TRANSLATIONS = {
            en: {
                SDK : {
                    PreviousButton: 'Previous',
                    NextButton: 'Next',
                    FinishButton: 'Finish'
                }
            }
        };
        return of(TRANSLATIONS[code]);
    }
}
// eslint-disable-next-line max-classes-per-file
@Component({
    template: `
        <ng-template #step1><div class="page page__1">Page 1</div></ng-template>
        <ng-template #step2><div class="page page__2">Page 2</div></ng-template>
        <ng-template #step3><div class="page page__3">Page 3 (the last page)</div></ng-template>

        <ddp-progress-indicator
            [steps]="[
                { label: 'Step 1', template: step1 },
                { label: 'Step 2', template: step2 },
                { label: 'Step 3', template: step3 }
            ]">
        </ddp-progress-indicator>
    `})
class WrapperComponent {
    @ViewChild(ProgressIndicatorComponent) componentRef: ProgressIndicatorComponent;
}

describe('ProgressIndicatorComponent', () => {
    let fixture: ComponentFixture<WrapperComponent>;
    let wrapperComponent: WrapperComponent;
    let component: ProgressIndicatorComponent;
    let debugElement: DebugElement;

    const getNextButton = () => {
        return debugElement.queryAll(By.css('.button.right'))[0].nativeElement;
    };
    const getPreviousButton = () => {
        return debugElement.queryAll(By.css('.button.left'))[0].nativeElement;
    };
    const getFinishButton = () => {
        return debugElement.queryAll(By.css('.button.finish'))[0].nativeElement;
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
                imports: [
                    MatStepperModule,
                    NoopAnimationsModule,
                    TranslateModule.forRoot({
                        loader: { provide: TranslateLoader, useClass: TranslateLoaderMock },
                    }),
                ],
                declarations: [WrapperComponent, ProgressIndicatorComponent],
            })
            .compileComponents();

        const translate = TestBed.inject(TranslateService);
        translate.use('en');
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(WrapperComponent);
        wrapperComponent = fixture.debugElement.componentInstance;
        debugElement = fixture.debugElement;
        fixture.detectChanges();
        component = wrapperComponent.componentRef; // <= ProgressIndicatorComponent
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have valid label on the first step', () => {
        const label = debugElement.queryAll(By.css(ACTIVE_STEP_LABEL_SELECTOR))[0];
        expect(label.nativeElement.textContent.trim()).toEqual('Step 1');
    });

    it('should have valid page content on the first step', () => {
        const textContent = debugElement.queryAll(By.css(ACTIVE_STEP_CONTENT_SELECTOR))[0];
        expect(textContent.nativeElement.textContent.trim()).toEqual('Page 1');
    });

    describe('Next step (by next button click):', () => {
        let nextButton: HTMLElement;
        let spy: jasmine.Spy;

        beforeEach(() => {
            spy = spyOn(component, 'onStepChanged');
            nextButton = getNextButton();
            nextButton.click();
            fixture.detectChanges();
        });

        it('should call onStepChanged after step change (with selectedIndex = 1)', () => {
            expect(component.onStepChanged).toHaveBeenCalled();
            const selectedIndex = spy.calls.first().args[0].selectedIndex;
            expect(selectedIndex).toEqual(1);
        });

        it('should have valid label', () => {
            const label = debugElement.queryAll(By.css(ACTIVE_STEP_LABEL_SELECTOR))[0];
            expect(label.nativeElement.textContent.trim()).toEqual('Step 2');
        });

        it('should have valid page content', () => {
            const textContent = debugElement.queryAll(By.css(ACTIVE_STEP_CONTENT_SELECTOR))[0];
            expect(textContent.nativeElement.textContent.trim()).toEqual('Page 2');
        });
    });

    describe('Previous step (by previous button click):', () => {
        let previousButton: HTMLElement;
        let spy: jasmine.Spy;

        beforeEach(() => {
            spy = spyOn(component, 'onStepChanged');
            getNextButton().click(); // open the second step
            fixture.detectChanges();
            previousButton = getPreviousButton();
            previousButton.click();
            fixture.detectChanges();
        });

        it('should call onStepChanged after step change (with selectedIndex = 0)', () => {
            expect(component.onStepChanged).toHaveBeenCalled();
            const selectedIndex = spy.calls.argsFor(1)[0].selectedIndex;
            expect(selectedIndex).toEqual(0);
        });

        it('should have valid label', () => {
            const label = debugElement.queryAll(By.css(ACTIVE_STEP_LABEL_SELECTOR))[0];
            expect(label.nativeElement.textContent.trim()).toEqual('Step 1');
        });

        it('should have valid page content', () => {
            const textContent = debugElement.queryAll(By.css(ACTIVE_STEP_CONTENT_SELECTOR))[0];
            expect(textContent.nativeElement.textContent.trim()).toEqual('Page 1');
        });
    });

    describe('Final step', () => {
        let finishButton: HTMLElement;
        let spy: jasmine.Spy;
        let labels: DebugElement[];
        let lastStepLabel: HTMLElement;

        beforeEach(() => {
            labels = debugElement.queryAll(By.css('.mat-step-label'));
            lastStepLabel = labels[labels.length - 1].nativeElement;
            lastStepLabel.click(); // open the final step
            fixture.detectChanges();

            spy = spyOn(component, 'finish');
            finishButton = getFinishButton();
            finishButton.click();
            fixture.detectChanges();
        });

        it('should call `finish` method on finish button click', () => {
            expect(component.finish).toHaveBeenCalled();
        });
    });
});
