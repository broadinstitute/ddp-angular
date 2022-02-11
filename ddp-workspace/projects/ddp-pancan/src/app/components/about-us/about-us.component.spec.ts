import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { AboutUsComponent } from './about-us.component';
import { mockComponent } from 'ddp-sdk';

describe('AboutUsComponent', () => {
    let component: AboutUsComponent;
    let fixture: ComponentFixture<AboutUsComponent>;
    const pageWithSections = mockComponent({selector: 'app-page-with-sections', inputs: ['source']});

    beforeEach(async () => {
        await TestBed.configureTestingModule({
                imports: [
                    RouterTestingModule,
                    NoopAnimationsModule
                ],
                declarations: [
                    AboutUsComponent,
                    pageWithSections
                ]
            })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AboutUsComponent);
        // component = fixture.componentInstance;
        // fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
