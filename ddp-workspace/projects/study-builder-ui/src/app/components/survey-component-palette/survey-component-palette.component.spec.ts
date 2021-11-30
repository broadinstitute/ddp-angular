import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyComponentPaletteComponent } from './survey-component-palette.component';

describe('SurveyComponentPaletteComponent', () => {
  let component: SurveyComponentPaletteComponent;
  let fixture: ComponentFixture<SurveyComponentPaletteComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SurveyComponentPaletteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveyComponentPaletteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
