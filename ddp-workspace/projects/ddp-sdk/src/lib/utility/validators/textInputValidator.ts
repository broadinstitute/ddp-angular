import { AbstractControl, ValidationErrors } from '@angular/forms';

export class TextInputValidator {
  static containNotOnlySpaces(control: AbstractControl): ValidationErrors | null {
    return (control.value as string).trim().length <= 0
      ? { containNotOnlySpaces: true }
      : null;
  }
}
