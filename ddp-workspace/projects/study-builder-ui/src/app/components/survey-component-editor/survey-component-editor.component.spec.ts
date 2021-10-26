import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyComponentEditorComponent } from './survey-component-editor.component';

describe('SurveyComponentEditorComponent', () => {
  let component: SurveyComponentEditorComponent;
  let fixture: ComponentFixture<SurveyComponentEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SurveyComponentEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveyComponentEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
