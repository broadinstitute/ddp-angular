import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ScientificResearchComponent } from './scientific-research.component';
import { mockComponent } from 'ddp-sdk';

describe('ScientificResearchComponent', () => {
    let component: ScientificResearchComponent;
    let fixture: ComponentFixture<ScientificResearchComponent>;
    const pageWithSections = mockComponent({selector: 'app-page-with-sections', inputs: ['source', 'linksMap']});

    beforeEach(async () => {
        await TestBed.configureTestingModule({
                imports: [
                    RouterTestingModule,
                    NoopAnimationsModule
                ],
                declarations: [
                    ScientificResearchComponent,
                    pageWithSections
                ]
            })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ScientificResearchComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
