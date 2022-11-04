import {Pipe, PipeTransform} from "@angular/core";
import {DateValidationErrorMessages} from "./utils/date-error.messages";

@Pipe({
  name: 'dateError'
})
export class DateErrorPipe implements PipeTransform {
  transform([errorKey]: [string, string], dateType?: string): string {
    return DateValidationErrorMessages[dateType][errorKey] || '';
  }
}