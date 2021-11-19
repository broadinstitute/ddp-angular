import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MedicalRecordAbstractionComponent } from './medical-record-abstraction.component';

describe('MedicalRecordAbstractionComponent', () => {
  let component: MedicalRecordAbstractionComponent;
  let fixture: ComponentFixture<MedicalRecordAbstractionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MedicalRecordAbstractionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicalRecordAbstractionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
