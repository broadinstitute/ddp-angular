import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PicklistQuestionEditorComponent } from './picklist-question-editor.component';

describe('PicklistQuestionEditorComponent', () => {
  let component: PicklistQuestionEditorComponent;
  let fixture: ComponentFixture<PicklistQuestionEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PicklistQuestionEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PicklistQuestionEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
