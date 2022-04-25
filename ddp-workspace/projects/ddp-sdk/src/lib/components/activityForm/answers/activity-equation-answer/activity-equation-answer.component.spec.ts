import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityEquationAnswerComponent } from './activity-equation-answer.component';

describe('ActivityEquationAnswerComponent', () => {
  let component: ActivityEquationAnswerComponent;
  let fixture: ComponentFixture<ActivityEquationAnswerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActivityEquationAnswerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityEquationAnswerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
