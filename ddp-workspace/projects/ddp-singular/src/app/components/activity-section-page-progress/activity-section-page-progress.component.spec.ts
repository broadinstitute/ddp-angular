import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivitySectionPageProgressComponent } from './activity-section-page-progress.component';

describe('ActivitySectionPageProgressComponent', () => {
  let component: ActivitySectionPageProgressComponent;
  let fixture: ComponentFixture<ActivitySectionPageProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActivitySectionPageProgressComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivitySectionPageProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
