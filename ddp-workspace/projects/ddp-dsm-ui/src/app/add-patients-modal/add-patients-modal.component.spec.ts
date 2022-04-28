import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPatientsModalComponent } from './add-patients-modal.component';

describe('AddPatientsModalComponent', () => {
  let component: AddPatientsModalComponent;
  let fixture: ComponentFixture<AddPatientsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPatientsModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPatientsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
