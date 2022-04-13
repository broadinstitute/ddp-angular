import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityBlockComponent } from './activityBlock.component';
import { ActivityServiceAgent } from '../../../../services/serviceAgents/activityServiceAgent.service';
import { ActivityRenderHintType } from '../../../../models/activity/activityRenderHintType';
import { LoggingService } from '../../../../services/logging.service';
import { ActivityActionsAgent } from '../../../../services/serviceAgents/activityActionsAgent.service';


describe('ActivityBlockComponent', () => {
    let component: ActivityBlockComponent;
    let fixture: ComponentFixture<ActivityBlockComponent>;
    let activityServiceAgentSpy: jasmine.SpyObj<ActivityServiceAgent>;
    let loggingServiceSpy: jasmine.SpyObj<LoggingService>;
    let activityActionsAgentSpy: jasmine.SpyObj<ActivityActionsAgent>;

    beforeEach(async () => {
        activityServiceAgentSpy = jasmine.createSpyObj('ActivityServiceAgent', ['createInstance', 'getActivitySummary']);
        loggingServiceSpy = jasmine.createSpyObj('LoggingService', ['logError']);
        activityActionsAgentSpy = jasmine.createSpyObj('ActivityActionsAgent', ['emitActivityBlockInstancesUpdated']);

        await TestBed.configureTestingModule({
                declarations: [ActivityBlockComponent],
                providers: [
                    {provide: ActivityServiceAgent, useValue: activityServiceAgentSpy},
                    {provide: LoggingService, useValue: loggingServiceSpy},
                    {provide: ActivityActionsAgent, useValue: activityActionsAgentSpy}
                ]
            })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ActivityBlockComponent);
        component = fixture.componentInstance;
        component.block = {
            renderHint: ActivityRenderHintType.Modal
        } as any;

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
