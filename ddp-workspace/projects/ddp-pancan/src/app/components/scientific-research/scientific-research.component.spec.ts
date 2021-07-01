import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScientificResearchComponent } from './scientific-research.component';

describe('ScientificResearchComponent', () => {
  let component: ScientificResearchComponent;
  let fixture: ComponentFixture<ScientificResearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScientificResearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScientificResearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
