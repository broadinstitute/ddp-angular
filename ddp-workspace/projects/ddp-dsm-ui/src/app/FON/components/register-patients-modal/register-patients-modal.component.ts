import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Subscription, tap} from "rxjs";

@Component({
  selector: 'app-add-patients-modal',
  templateUrl: './register-patients-modal.component.html',
  styleUrls: ['./register-patients-modal.component.scss'],
})
export class RegisterPatientsModalComponent implements OnInit {
  uploading: boolean = false;

  readonly addPatientForm: FormGroup = this.formBuilder.group({
    patients: this.formBuilder.array([])
  });

  constructor(private dialogRef: MatDialogRef<RegisterPatientsModalComponent>,
              private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.addPatient();
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
    console.log(this.addPatientForm.getRawValue())
    this.uploading = true;
    setTimeout(() => {
      this.closeDialog();
      this.uploading = false;
    }, 2000)

  }

  public closeDialog(): void {
    this.dialogRef.close();
  }
}
