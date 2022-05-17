import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CohortTagComponent } from './cohort-tag.component';

describe('CohortTagComponent', () => {
  let component: CohortTagComponent;
  let fixture: ComponentFixture<CohortTagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CohortTagComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CohortTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
