import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForResearchesComponent } from './for-researches.component';

describe('ForResearchesComponent', () => {
  let component: ForResearchesComponent;
  let fixture: ComponentFixture<ForResearchesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForResearchesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForResearchesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
