import { ErrorStateMatcher } from '@angular/material/core';
import { FormControl, FormGroupDirective, NgForm } from '@angular/forms';

/**
 * Implementation of ErrorStateMatcher that allows for displaying form group errors
 * by mat-error within a FormGroup right away/without waiting for field to be touched.
 */
export class InstantErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null,
        form: FormGroupDirective | NgForm | null): boolean {
        return control && control.invalid;
    }
}
