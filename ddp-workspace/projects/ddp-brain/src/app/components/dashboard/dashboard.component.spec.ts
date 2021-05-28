import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BehaviorSubject } from 'rxjs';
import { DashboardComponent } from './dashboard.component';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { mockComponent } from 'ddp-sdk';

describe('DashboardComponent', () => {
    let fixture: ComponentFixture<DashboardComponent>;
    let component: DashboardComponent;
    let debugElement: DebugElement;
    const paramMapSubject = new BehaviorSubject(convertToParamMap({userGuid: '123'}));

    beforeEach(async() => {
        const toolkitDashboard = mockComponent({ selector: 'toolkit-dashboard-redesigned', inputs: ['selectedUserGuid'] });
        await TestBed.configureTestingModule({
            imports: [NoopAnimationsModule],
            providers: [{ provide: ActivatedRoute, useValue: {paramMap: paramMapSubject} }],
            declarations: [DashboardComponent, toolkitDashboard],
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DashboardComponent);
        component = fixture.debugElement.componentInstance;
        debugElement = fixture.debugElement;
        fixture.detectChanges();
    });

    it('should create component', () => {
        expect(component).toBeTruthy();
    });

    it('should emit selectedUserGuid$ from param', (done) => {
        paramMapSubject.next(convertToParamMap({userGuid: '123'}));
        const subscription = component.selectedUserGuid$.subscribe((result) => {
            expect(result).toBe('123');
            done();
        });
        subscription.unsubscribe();
    });

    it('should emit empty selectedUserGuid$ from param', (done) => {
        paramMapSubject.next(convertToParamMap({userGuid: ''}));
        const subscription = component.selectedUserGuid$.subscribe((result) => {
            expect(result).toBe('');
            done();
        });
        subscription.unsubscribe();
    });
});
