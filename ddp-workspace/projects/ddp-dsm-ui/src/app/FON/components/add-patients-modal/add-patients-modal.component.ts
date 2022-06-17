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

  public getErrorMessage(index: number, formField: string): string {
    const formControl = this.patients.at(index).get(formField);

    if(formControl.hasError('required')) return 'You must enter a value';

    return formControl.hasError('email') ? 'Not a valid email' : '';
  }

  public get patients(): FormArray {
    return this.addPatientForm.controls.patients as FormArray
  }

  public addPatient(): void {
    const patient = this.fromBuilder.group({
      email: new FormControl(null, [Validators.required, Validators.email]),
      firstName: new FormControl(null, Validators.required),
      lastName: new FormControl(null, Validators.required),
      dateOfBirth: new FormControl(null, Validators.required),
      informedConsentDate: new FormControl(null, Validators.required),
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
