import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityBlockComponent } from './activityBlock.component';

describe('ActivityBlockComponent', () => {
    let component: ActivityBlockComponent;
    let fixture: ComponentFixture<ActivityBlockComponent>;

    beforeEach(async() => {
        await TestBed.configureTestingModule({
                declarations: [ActivityBlockComponent]
            })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ActivityBlockComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
