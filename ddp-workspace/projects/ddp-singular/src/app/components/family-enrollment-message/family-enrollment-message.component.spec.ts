import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilyEnrollmentMessageComponent } from './family-enrollment-message.component';

describe('FamilyEnrollmentMessageComponent', () => {
  let component: FamilyEnrollmentMessageComponent;
  let fixture: ComponentFixture<FamilyEnrollmentMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FamilyEnrollmentMessageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FamilyEnrollmentMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
