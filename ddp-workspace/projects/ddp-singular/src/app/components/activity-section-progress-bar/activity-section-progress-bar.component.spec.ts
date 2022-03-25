import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivitySectionProgressBarComponent } from './activity-section-progress-bar.component';

describe('ActivitySectionProgressBarComponent', () => {
  let component: ActivitySectionProgressBarComponent;
  let fixture: ComponentFixture<ActivitySectionProgressBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActivitySectionProgressBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivitySectionProgressBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
