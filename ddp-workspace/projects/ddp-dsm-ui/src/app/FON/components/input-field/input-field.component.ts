import {ChangeDetectionStrategy, Component, Injector, Input, OnInit} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormControlDirective,
  FormControlName,
  FormGroupDirective,
  NG_VALUE_ACCESSOR,
  NgControl
} from '@angular/forms';


@Component({
  selector: 'app-input-field',
  template: `

    <ng-container *ngIf="type === TEXT">
      <div class="input_field_primary">
        <mat-label>{{label}}</mat-label>
        <mat-form-field appearance="outline">
          <input
            matInput
            #inputTextElement
            (input)="setValue(inputTextElement)"
            [formControl]="formControl"
            [placeholder]="placeholder"
          >
          <mat-error>{{getErrorMessage}}</mat-error>
        </mat-form-field>
      </div>
    </ng-container>

    <ng-container *ngIf="type === DATE">
      <div class="input_field_primary">
        <mat-label>{{label}}</mat-label>
        <mat-form-field appearance="outline">
          <input
            #inputDateElement
            matInput
            (input)="setValue(inputDateElement)"
            [formControl]="formControl"
            [matDatepicker]="picker"
            [placeholder]="placeholder"
          >
          <mat-error>{{getErrorMessage}}</mat-error>
          <mat-datepicker-toggle
            matSuffix
            [for]="picker">
          </mat-datepicker-toggle>
          <mat-datepicker touchUi #picker></mat-datepicker>
        </mat-form-field>
      </div>
    </ng-container>

  `,
  styleUrls: ['./input-field.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: InputFieldComponent,
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputFieldComponent implements OnInit, ControlValueAccessor {
  public value: any;
  public formControl: FormControl;

  public onTouched: () => void;
  public onChange: (value: any) => void = () => {};

  @Input('inputType') type: string;
  @Input() label: string;
  @Input() placeholder: string;

  readonly TEXT: string = 'text';
  readonly DATE: string = 'date';

  constructor(private injector: Injector) {}

  public ngOnInit(): void {
    const ngControl = this.injector.get(NgControl);
    if (ngControl instanceof FormControlName) {
      this.formControl = this.injector.get(FormGroupDirective).getControl(ngControl);
    } else {
      this.formControl = (ngControl as FormControlDirective).form as FormControl;
    }
  }


  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  public writeValue(obj: any): void {
    this.value = obj;
  }

  public setValue(inputElement: HTMLInputElement): void {
    this.value = inputElement.value;
    this.onChange(this.value);
    this.onTouched();
  }

  public get getErrorMessage(): string {
    if (this.formControl.hasError('required')) {return 'You must enter a value';}
    return this.formControl.hasError('pattern') ? 'Not a valid email' : '';
  }

}
