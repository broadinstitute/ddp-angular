import { ChangeDetectorRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {BehaviorSubject, of, Subject} from 'rxjs';
import {
    SessionMementoService,
    TemporaryUserServiceAgent,
    WorkflowServiceAgent,
    WindowRef,
    SessionStorageService
} from 'ddp-sdk';
import { HeaderConfigurationService, WorkflowBuilderService } from 'toolkit';
import { WorkflowStartComponent } from './workflow-start.component';

describe('WorkflowStartComponent', () => {
    let fixture: ComponentFixture<WorkflowStartComponent>;
    let component: WorkflowStartComponent;

    let headerConfigSpy: jasmine.SpyObj<HeaderConfigurationService>;
    let sessionSpy: jasmine.SpyObj<SessionMementoService>;
    let temporaryUserServiceSpy: jasmine.SpyObj<TemporaryUserServiceAgent>;

    beforeEach(async () => {
        headerConfigSpy = jasmine.createSpyObj('headerConfigSpy', ['setupActivityHeader',
            'setupDefaultHeader']);
        sessionSpy = jasmine.createSpyObj('SessionMementoService', ['isTemporarySession',
            'isAuthenticatedSession', 'setTemporarySession', 'sessionObservable']);
        temporaryUserServiceSpy = jasmine.createSpyObj(
            'TemporaryUserServiceAgent',
            {createTemporaryUser: of({})}
        );

        await TestBed.configureTestingModule({
                providers: [
                    { provide: HeaderConfigurationService, useValue: headerConfigSpy },
                    { provide: WorkflowBuilderService, useValue: {} },
                    { provide: TemporaryUserServiceAgent, useValue: temporaryUserServiceSpy },
                    { provide: SessionMementoService, useValue: sessionSpy },
                    { provide: WorkflowServiceAgent, useValue: {getStart: () => of({})} },
                    { provide: WindowRef, useValue: {} },
                    { provide: ChangeDetectorRef, useValue: {} },
                    { provide: SessionStorageService, useValue: {remove: () => {}} },
                    { provide: 'ddp.config', useValue: {} },
                    { provide: 'toolkit.toolkitConfig', useValue: {} },
                ],
                declarations: [WorkflowStartComponent],
            })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(WorkflowStartComponent);
        component = fixture.debugElement.componentInstance;
        (sessionSpy as any).sessionObservable = new BehaviorSubject<any>({});
        fixture.detectChanges();
    });

    it('should create component', () => {
        expect(component).toBeTruthy();
    });

    it('should set header config for a temporary user', () => {
        sessionSpy.isTemporarySession.and.returnValue(true);
        (sessionSpy.sessionObservable as Subject<any>).next({});

        component.ngOnInit();

        expect(headerConfigSpy.showBreadcrumbs).toBeFalse();
        expect(headerConfigSpy.showMainButtons).toBeTrue();
    });
});
