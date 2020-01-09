import { ErrorStateMatcher } from '@angular/material';
import { FormControl, FormGroupDirective, NgForm } from '@angular/forms';

export class InstantErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null,
                 form: FormGroupDirective | NgForm | null): boolean {
        return control && control.invalid;
    }
}
