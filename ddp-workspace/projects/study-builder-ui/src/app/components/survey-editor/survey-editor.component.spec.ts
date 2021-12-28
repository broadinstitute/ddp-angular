import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyEditorComponent } from './survey-editor.component';
import { SurveyCanvasComponent } from '../survey-canvas/survey-canvas.component';

describe('SurveyEditorComponent', () => {
  let component: SurveyEditorComponent;
  let fixture: ComponentFixture<SurveyEditorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SurveyEditorComponent, SurveyCanvasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveyEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
