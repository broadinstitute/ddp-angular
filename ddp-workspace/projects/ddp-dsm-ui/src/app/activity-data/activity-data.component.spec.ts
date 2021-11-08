import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ActivityDataComponent } from './activity-data.component';

describe('ActivityDataComponent', () => {
  let component: ActivityDataComponent;
  let fixture: ComponentFixture<ActivityDataComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
