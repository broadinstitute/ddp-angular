import {ValidatorFn} from '@angular/forms';

export interface InputField {
  controllerName: string;
  placeholder: string;
  maxLength: number | undefined;
  validators: ValidatorFn[];
}
