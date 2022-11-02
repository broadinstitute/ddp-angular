import {Pipe, PipeTransform} from "@angular/core";
import {DateValidationErrorMessages} from "./date-error.messages";

@Pipe({
  name: 'dateError'
})
export class DateErrorPipe implements PipeTransform {
  transform([errorKey]: [string, string], dateType?: string): any {
    return DateValidationErrorMessages[dateType][errorKey] || '';
  }
}
