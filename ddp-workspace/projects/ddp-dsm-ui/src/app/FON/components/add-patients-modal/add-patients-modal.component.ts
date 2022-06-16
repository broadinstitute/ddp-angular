import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-add-patients-modal',
  templateUrl: './add-patients-modal.component.html',
  styleUrls: ['./add-patients-modal.component.scss'],
})
export class AddPatientsModalComponent implements OnInit {

  readonly addPatientForm: FormGroup = this.fromBuilder.group({
    patients: this.fromBuilder.array([])
  })

  constructor(public dialogRef: MatDialogRef<AddPatientsModalComponent>,
              private fromBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.addPatient();
    this.dialogRef.updatePosition({ top: '24px'});
  }

  public get patients(): FormArray {
    return this.addPatientForm.controls.patients as FormArray
  }

  public addPatient(): void {
    const patient = this.fromBuilder.group({
      email: new FormControl(null, Validators.required),
      firstName: new FormControl(null),
      lastName: new FormControl(null),
      dateOfBirth: new FormControl(null),
      informedConsentDate: new FormControl(null),
      assentDate: new FormControl(null)
    })

    this.patients.push(patient)
  }

  public removePatient(index: number): void {
    this.patients.removeAt(index);
  }

  public registerPatient() {
    const {patients} = this.addPatientForm.getRawValue();
    this.closeDialog(patients);
  }

  public closeDialog(patients?: any[]) {
    this.dialogRef.close(patients);
  }
}
