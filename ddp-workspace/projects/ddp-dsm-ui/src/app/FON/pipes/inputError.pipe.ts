import {Pipe, PipeTransform} from "@angular/core";
import {ValidationErrors} from "@angular/forms";
import {InputErrorsModel} from "../models/inputErrors.model";

@Pipe({
  name: 'inputError'
})
export class InputErrorPipe implements PipeTransform{
  transform(formErrors: ValidationErrors | null | undefined, inputErrors: InputErrorsModel): string | null {
    if(!formErrors || !inputErrors) return null;
    const [key] = Object.keys(formErrors);
    return inputErrors[key];
  }
}
