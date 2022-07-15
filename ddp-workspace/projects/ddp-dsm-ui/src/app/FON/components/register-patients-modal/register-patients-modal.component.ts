import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {PatientsService} from '../../services/patients.service';
import {forkJoin, Observable, of, Subject} from 'rxjs';
import {HttpService} from '../../services/http.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AddPatientModel} from '../../models/addPatient.model';
import {catchError, takeUntil} from 'rxjs/operators';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-add-patients-modal',
  templateUrl: './register-patients-modal.component.html',
  styleUrls: ['./register-patients-modal.component.scss'],
})
export class RegisterPatientsModalComponent implements OnInit, OnDestroy {
  isAddingPatient: boolean;
  addedPatients: number;

  readonly patientsHttpArray: Observable<any>[] = [];
  readonly patientsGroup: FormGroup = this.formBuilder.group({
    patients: this.formBuilder.array([])
  });

  unsubSubject = new Subject<void>();

  @ViewChild('successMessage') successMessageTemplate: TemplateRef<any>;

  constructor(
    private dialogRef: MatDialogRef<RegisterPatientsModalComponent>,
    private formBuilder: FormBuilder,
    private patientsService: PatientsService,
    private httpService: HttpService,
    private _snackBar: MatSnackBar
  ) {
  }

  ngOnInit(): void {
    this.addPatient();
  }

  ngOnDestroy(): void {
    this.unsubSubject.next();
  }

  public get patients(): FormArray {
    return this.patientsGroup.controls.patients as FormArray;
  }

  public addPatient(): void {
    this.patients.push(this.patientFormGroup);
  }

  public removePatient(index: number): void {
    this.patients.removeAt(index);
  }

  public registerPatient(): void {
    this.isAddingPatient = true;
    this.patientsGroup.getRawValue()
      .patients
      .forEach(patient => {
          const generatedPatientInfo = this.patientsService.generatePatientInfo(patient);
          this.patientsHttpArray.push(this.getPatientHttp(generatedPatientInfo));
        }
      );
    this.uploadPatients();
  }

  public closeDialog(): void {
    this.dialogRef.close();
  }

  private uploadPatients(): void {
    forkJoin(this.patientsHttpArray)
      .pipe(takeUntil(this.unsubSubject))
      .subscribe((resultPatients) => {
        this.addedPatients = resultPatients
          .filter(patient => !(patient instanceof HttpErrorResponse))
          .length;
        this.closeDialog();
        this.openSnackbar();
      });
  }

  private getPatientHttp(patient: AddPatientModel): Observable<any> {
    return this.httpService.addPatient(patient).pipe(catchError(error => of(error)));
  }

  private get patientFormGroup(): FormGroup {
    return this.formBuilder.group({
      email: new FormControl(null, {
        validators: [Validators.required, this.customEmailValidator],
        updateOn: 'blur'
      }),
      firstName: new FormControl(null, Validators.required),
      lastName: new FormControl(null, Validators.required),
      birthDate: new FormControl(null, [Validators.required, this.isPast]),
      consentDate: new FormControl(null, [Validators.required, this.isNotFuture]),
      assentDate: new FormControl(null, [this.isNotFuture])
    });
  }

  private openSnackbar(): void {
    this._snackBar.openFromTemplate(this.successMessageTemplate, {
      duration: 5000,
      panelClass: 'snackBarRestyle',
      verticalPosition: 'top',
      horizontalPosition: 'right'
    });
  }

  private isNotFuture(formControl: FormControl): {[s:string]: boolean} {
    return new Date(formControl.value) > new Date() ? {'isFuture': true} : null;
  }

  private isPast(formControl: FormControl): {[s:string]: boolean} {
    return new Date(formControl.value)
      .setHours(0, 0 ,0, 0) >=
    new Date()
      .setHours(0, 0 ,0, 0) ? {'isPast': true} : null;
  }

  private customEmailValidator(formControl: FormControl): {[s:string]: boolean} {
    const value = formControl.value;
    return /^[\w- ()+-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value) ? null : {'invalidEmail': true};
  }
}
