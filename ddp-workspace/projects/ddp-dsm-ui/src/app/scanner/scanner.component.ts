import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, DoCheck, ElementRef, OnDestroy,
  QueryList,
  Self,
  ViewChildren
} from '@angular/core';
import {ScannerService} from './services/scanner.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {
  AbstractControl,
  FormArray, FormBuilder,
  FormControl,
  FormGroup
} from '@angular/forms';
import {Subject, takeUntil} from 'rxjs';
import {InputField} from './interfaces/input-field';
import {Auth} from '../services/auth.service';
import {Statics} from '../utils/statics';
import {Scanner} from './interfaces/scanners';
import {first} from 'rxjs/operators';
// changing
@Component({
  selector: 'app-scanner',
  templateUrl: 'scanner.component.html',
  styleUrls: ['scanner.component.scss'],
  providers: [ScannerService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScannerComponent implements DoCheck, OnDestroy {
  public activeScanner!: Scanner;
  public activeScannerFormGroup: FormGroup = this.fb.group({
    scannerFields: this.fb.array([])
  });
  public additionalMessage: string | undefined;

  private updatePreviousFieldValidations = false;
  private readonly subscriptionSubject$: Subject<void> = new Subject<void>();

  @ViewChildren('htmlInputElement') inputFields: QueryList<ElementRef<HTMLInputElement>>;

  constructor(
    @Self() private readonly scannerService: ScannerService,
    private readonly fb: FormBuilder,
    private readonly activatedRoute: ActivatedRoute,
    private readonly cdr: ChangeDetectorRef,
    private readonly router: Router
  ) {
    activatedRoute.queryParams
      .pipe(takeUntil(this.subscriptionSubject$))
      .subscribe(({scannerType}: Params) => this.initialize(scannerType));
  }

  ngOnDestroy(): void {
    this.subscriptionSubject$.next();
    this.subscriptionSubject$.complete();
  }

  ngDoCheck(): void {
    this.scannerFields.length > 1 && this.resetValidations();
  }

  public get scannerFields(): FormArray {
    return this.activeScannerFormGroup.get('scannerFields') as FormArray;
  }

  public removeFields(index: number): void {
    this.scannerFields.length - 1 && this.scannerFields.removeAt(index);
    this.activeScanner.inputFields.forEach((inputField: InputField) =>
      this.checkForDuplicates(inputField.controllerName));
  }

  public save(): void {
    this.additionalMessage = '';
    const filteredActiveScannerFieldsGroupsArray = this.filteredNonNullFieldsGroups;

    this.activeScanner.saveFn(filteredActiveScannerFieldsGroupsArray)
      .pipe(
        takeUntil(this.subscriptionSubject$)
      )
      .subscribe({
        next: (data: any[]) => {
          this.cdr.markForCheck();
          if (data.some(d => d?.hasOwnProperty('error'))) {
            this.removeSuccessfulScans(data);
            this.additionalMessage = 'Error - Failed to save all changes';
          } else {
            this.resetForm();
            this.additionalMessage = 'Data saved';
          }
        },
        error: async (error: any) => {
          this.cdr.markForCheck();
          if (error.body === Auth.AUTHENTICATION_ERROR) {
            await this.router.navigate([Statics.HOME_URL]);
          }
          this.additionalMessage = 'Error - Failed to save data';
        }
      });
  }

  public addInputsGroupAndOrMoveFocus(
    formControlIndex: number,
    scannerFieldIndex: number,
    htmlInputElement: HTMLInputElement): void {
    if (scannerFieldIndex === this.scannerFields.controls.length - 1 &&
      formControlIndex === this.activeScanner.inputFields.length - 1) {
      this.addFields();
      this.moveFocusLazy(htmlInputElement);
    } else {
      this.moveFocusEager(htmlInputElement);
    }
  }

  public resetValidations(): void {
    if(this.updatePreviousFieldValidations) {
      const previousFormControls = Object.values((this.scannerFields.at(this.scannerFields.length - 2) as FormGroup).controls);
      previousFormControls.forEach((formControl: FormControl) => formControl.updateValueAndValidity({emitEvent: false}));
      this.updatePreviousFieldValidations = false;
    }
    const lastFormGroupControls = Object.values((this.scannerFields.at(this.scannerFields.length - 1) as FormGroup).controls);
    lastFormGroupControls.forEach((formControl: FormControl) => formControl.setErrors(null));
  }

  public addFields(): void {
    const formGroup = this.fb.group({});
    this.activeScanner.inputFields.forEach((inputField: InputField) =>
      formGroup.addControl(inputField.controllerName, this.fb.control(null, [...inputField.validators])));
    this.scannerFields.push(formGroup, {emitEvent: false});
    this.updatePreviousFieldValidations = true;
  }

  public checkForDuplicates(formControlName: string): void {
    const formControlsColumn: AbstractControl[] = (this.scannerFields.controls as FormGroup[])
      .map((formGroup: FormGroup) => formGroup.get(formControlName));

    const duplicatedValueControllers: Set<AbstractControl> = new Set();

    for (const compare of formControlsColumn) {
      for (const to of formControlsColumn) {
        compare.hasError('duplicatedValue') && compare.setErrors(null);
        compare.updateValueAndValidity({emitEvent: false});
        if (compare !== to && compare.value && to.value &&
          compare.value === to.value) {
          duplicatedValueControllers.add(compare);
          duplicatedValueControllers.add(to);
        }
      }
    }

    duplicatedValueControllers.size > 1 && duplicatedValueControllers
      .forEach((formControl: AbstractControl) =>
        formControl.setErrors({duplicatedValue: true}));
  }

  private moveFocusLazy(htmlInputElement: HTMLInputElement): void {
    this.inputFields.changes
      .pipe(first())
      .subscribe(() => this.moveFocusEager(htmlInputElement));
  }

  private moveFocusEager(htmlInputElement: HTMLInputElement, inputFields: QueryList<ElementRef> = this.inputFields): void {
    const foundIndex: number = inputFields
      .toArray()
      .findIndex((inputField: ElementRef) => inputField.nativeElement === htmlInputElement);

    this.inputFields.get(foundIndex + 1)?.nativeElement.focus();
  }

  private removeSuccessfulScans(responseData: any[]): void {
    responseData.forEach((data: any, index: number) => data?.hasOwnProperty('error') &&
      this.scannerFields.at(index).setErrors({notFound: data?.error})
    );
    for (let i = this.scannerFields.length - 2; i >= 0; i--) {
      !this.scannerFields.at(i).hasError('notFound') && this.scannerFields.removeAt(i);
    }
  }

  private get filteredNonNullFieldsGroups(): object[] {
    return this.scannerFields.getRawValue()
      .filter((fieldsGroup: object) => Object.values(fieldsGroup).every((fieldValue: string | null) => fieldValue));
  }

  private initialize(scannerType: string): void {
    this.cdr.markForCheck();
    this.additionalMessage = '';
    this.activeScanner = this.scannerService.getScanner(scannerType);

    this.resetForm();
    setTimeout(() => this.inputFields.get(0).nativeElement.focus());
  }

  private resetForm(): void {
    this.scannerFields.reset({emitEvent: false});
    this.scannerFields.clear({emitEvent: false});
    this.addFields();
  }
}
