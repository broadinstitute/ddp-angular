import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, ElementRef,
  OnDestroy,
  QueryList,
  Self,
  ViewChildren
} from '@angular/core';
import {ScannerService} from './services/scanner.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup
} from '@angular/forms';
import { Observable, Subject, takeUntil} from 'rxjs';
import {InputField} from './interfaces/input-field';
import {Auth} from '../services/auth.service';
import {Statics} from '../utils/statics';

/*
 map(data => [
          {kit: 'giogio', error: 'No kit for participant with ShortId \\"dsadad\\" was not found.\\nFor more
          information please contact your DSM developer'},
        ]),
        catchError(() => {
          return of([
            {kit: 'giogio', error: 'No kit for participant with ShortId \\"dsadad\\" was not found.\\nFor more
             information please contact your DSM developer'},
          ])
        }),
*/

@Component({
  selector: 'app-scanner',
  templateUrl: 'scanner.component.html',
  styleUrls: ['scanner.component.scss'],
  providers: [ScannerService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScannerComponent implements OnDestroy {
  @ViewChildren('inputFields') inputFields: QueryList<ElementRef<HTMLInputElement>>;

  public additionalMessage: string | undefined;

  public activeScannerTitle: string;
  public scanReceived: boolean;

  public activeScannerFormGroup: FormGroup;
  public activeScannerSaveFunction: (data: object) => Observable<any>;
  public activeScannerButtonValue: string;
  public activeScannerInputFields: InputField[];

  private readonly subscriptionSubject$ = new Subject<void>();

  constructor(
    @Self() private readonly scannerService: ScannerService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly cdr: ChangeDetectorRef,
    private readonly router: Router
  ) {
    activatedRoute.queryParams
      .pipe(takeUntil(this.subscriptionSubject$))
      .subscribe(({scannerType = ''}: Params) => this.initialize(scannerType));
  }

  ngOnDestroy(): void {
    this.subscriptionSubject$.next();
    this.subscriptionSubject$.complete();
  }

  public get scannerFields(): FormArray {
    return this.activeScannerFormGroup.controls['scannerFields'] as FormArray;
  }

  public removeFields(index: number): void {
    this.scannerFields.length - 1 && this.scannerFields.removeAt(index);
  }

  public save({scannerFields}): void {
    const filteredFields = scannerFields
      .filter((field: object) => Object.values(field).every((value: string | null) => value));

    this.activeScannerSaveFunction(filteredFields)
      .pipe(
        takeUntil(this.subscriptionSubject$)
      )
      .subscribe({
        next: (data: any[]) => {
          console.log(data, 'FIRST_DATA');
          this.cdr.markForCheck();
          if(data.length) {
            this.removeSuccessfulScans(data);
            this.additionalMessage = 'Error - Failed to save all changes';
              if(data.length === 1 && data[0].kit === data[0].error) {
                this.additionalMessage = 'Data saved for ' + data[0].kit;
                this.scannerFields.reset({emitEvent: false});
                this.scannerFields.clear({emitEvent: false});
                this.addFields();
              }
          } else {
            this.scannerFields.reset({emitEvent: false});
            this.scannerFields.clear({emitEvent: false});
            this.addFields();
            this.additionalMessage = 'Data saved';
          }
        },
        error: async (error: any) => {
          this.cdr.markForCheck();
          if (error._body === Auth.AUTHENTICATION_ERROR) {
            await this.router.navigate([Statics.HOME_URL]);
          }
          this.additionalMessage = 'Error - Failed to save data';
        }
      });
  }

  public moveFocusAndAdd(formControlIndex: number, scannerFieldIndex: number, inputField: HTMLInputElement): void {
    scannerFieldIndex === this.scannerFields.controls.length - 1 &&
    formControlIndex === this.activeScannerInputFields.length - 1 &&
    this.addFields();

    const foundIndex: number = this.inputFields.toArray()
      .findIndex((inElement) => inElement.nativeElement === inputField);

    this.inputFields.get(foundIndex + 1)?.nativeElement.focus();
  }

  public noValidatorsForLastItem(): void {
    if(this.scannerFields.length > 1) {
      const formControls = Object.values((this.scannerFields.at(this.scannerFields.length - 1) as FormGroup).controls);
      formControls.forEach((formControl: FormControl) => formControl.setErrors(null));
    }
  }

  public addFields(): void {
    const formGroup = new FormGroup({});
    this.activeScannerInputFields.forEach((inputField: InputField) =>
      formGroup.addControl(inputField.controllerName, new FormControl(null, [...inputField.validators])));
    this.scannerFields.push(formGroup, {emitEvent: false});
  }

  public checkForDuplicates(formControlName: string): void {
    const formControls: AbstractControl[] = (this.scannerFields.controls as FormGroup[])
      .map((formGroup: FormGroup) => formGroup.controls[formControlName]);

    const duplicateValueControllers: Set<AbstractControl> = new Set();

    for(const formControlCompare of formControls) {
      for(const formControlTo of formControls) {
        formControlCompare.hasError('duplicateValue') && formControlCompare.setErrors(null);
        if(formControlCompare !== formControlTo && formControlCompare.value && formControlTo.value &&
          formControlCompare.value === formControlTo.value) {
          duplicateValueControllers.add(formControlCompare);
          duplicateValueControllers.add(formControlTo);
        }
      }
    }

    duplicateValueControllers.size > 1 && duplicateValueControllers.forEach((formControl: AbstractControl) =>
      formControl.setErrors({duplicateValue: true}));
  }

  private removeSuccessfulScans(responseData: any[]): void {
    console.log(responseData, 'REMOVE_SUCCESSFUL_SCANS');

    const filteredFields = this.scannerFields.getRawValue()
      .filter((field: object) => Object.values(field).some((value: string | null) => value));

    console.log(filteredFields, 'MAIN_FORM');

    const removeIndexes = [];

    filteredFields.forEach((filteredObject: object, filterObjectIndex: number) => {
      const lastField = (Object.keys(filteredObject) as any).at(-1);
      const foundObject = responseData.find((responseObject: any) => filteredObject[lastField] === responseObject.kit);
      if(foundObject) {
        this.scannerFields.at(filterObjectIndex).setErrors({notFound: foundObject?.error});
        console.log(this.scannerFields, filterObjectIndex, 'FOUND_OBJECT');
      } else {
        removeIndexes.push(filteredObject);
      }
    });

    console.log(removeIndexes, 'INDEXES');

    removeIndexes.length && removeIndexes.forEach((objectToRemove: object) => {
      const lastField1 = (Object.keys(objectToRemove) as any).at(-1);
      const findObjectIndex = this.scannerFields.getRawValue().findIndex((objectValue: any) => {
        const lastField2 = (Object.keys(objectValue) as any).at(-1);
        return objectValue[lastField2] === objectToRemove[lastField1];
      });
      this.scannerFields.removeAt(findObjectIndex);
    });

  }

  private initialize(scannerType: string): void {
    this.cdr.markForCheck();

    const {title, saveFn, buttonValue, inputFields} =
      this.scannerService.getScanner(scannerType);

    this.activeScannerTitle = title;
    this.activeScannerSaveFunction = saveFn;
    this.activeScannerButtonValue = buttonValue;
    this.activeScannerInputFields = inputFields;
    this.scanReceived = scannerType === 'receiving';

    this.activeScannerFormGroup = new FormGroup({
      scannerFields: new FormArray([])
    });

    this.scannerFields.reset({emitEvent: false});
    this.scannerFields.clear({emitEvent: false});
    this.addFields();
  }
}
