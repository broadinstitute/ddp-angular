import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PicklistQuestionBlockComponent } from './picklist-question-block.component';

describe('PicklistQuestionBlockComponent', () => {
  let component: PicklistQuestionBlockComponent;
  let fixture: ComponentFixture<PicklistQuestionBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PicklistQuestionBlockComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PicklistQuestionBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
