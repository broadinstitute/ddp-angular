import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForCliniciansComponent } from './for-clinicians.component';

describe('ForCliniciansComponent', () => {
  let component: ForCliniciansComponent;
  let fixture: ComponentFixture<ForCliniciansComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ForCliniciansComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForCliniciansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
