import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-add-patients-modal',
  templateUrl: './register-patients-modal.component.html',
  styleUrls: ['./register-patients-modal.component.scss'],
})
export class RegisterPatientsModalComponent implements OnInit {

  readonly addPatientForm: FormGroup = this.formBuilder.group({
    patients: this.formBuilder.array([])
  });

  constructor(public dialogRef: MatDialogRef<RegisterPatientsModalComponent>,
              private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.addPatient();
    this.dialogRef.updatePosition({ top: '24px'});
  }

  public get patients(): FormArray {
    return this.addPatientForm.controls.patients as FormArray;
  }

  public addPatient(): void {
    const patient = this.formBuilder.group({
      email: new FormControl(null, [Validators.required, Validators.email]),
      firstName: new FormControl(null, Validators.required),
      lastName: new FormControl(null, Validators.required),
      dateOfBirth: new FormControl(null, Validators.required),
      informedConsentDate: new FormControl(null, Validators.required),
      assentDate: new FormControl(null)
    });

    this.patients.push(patient);
  }

  public removePatient(index: number): void {
    this.patients.removeAt(index);
  }

  public registerPatient(): void {
    const {patients} = this.addPatientForm.getRawValue();
    this.closeDialog(patients);
  }

  public closeDialog(patients?: any[]): void {
    this.dialogRef.close(patients);
  }
}
