import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityBlockComponent } from './activityBlock.component';
import { ActivityServiceAgent } from '../../../../services/serviceAgents/activityServiceAgent.service';
import { ActivityRenderHintType } from '../../../../models/activity/activityRenderHintType';

describe('ActivityBlockComponent', () => {
    let component: ActivityBlockComponent;
    let fixture: ComponentFixture<ActivityBlockComponent>;
    let activityServiceAgentSpy: jasmine.SpyObj<ActivityServiceAgent>;

    beforeEach(async() => {
        activityServiceAgentSpy = jasmine.createSpyObj('ActivityServiceAgent', ['createInstance', 'getActivitySummary']);

        await TestBed.configureTestingModule({
                declarations: [ActivityBlockComponent],
                providers: [{
                    provide: ActivityServiceAgent,
                    useValue: activityServiceAgentSpy
                }]
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
