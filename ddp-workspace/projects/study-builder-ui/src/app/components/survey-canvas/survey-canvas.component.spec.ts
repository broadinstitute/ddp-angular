import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyCanvasComponent } from './survey-canvas.component';

describe('SurveyCanvasComponent', () => {
  let component: SurveyCanvasComponent;
  let fixture: ComponentFixture<SurveyCanvasComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SurveyCanvasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveyCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
