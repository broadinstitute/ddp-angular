import {Pipe, PipeTransform} from '@angular/core';
import {KeyValue} from "@angular/common";
import {ValidationErrors} from "@angular/forms";
import {DateValidationErrorMessages} from "./constants/date-error.messages";

@Pipe({
  name: 'dateError'
})
export class DateErrorPipe implements PipeTransform {
  transform({key, value}: KeyValue<string, ValidationErrors>, dateType?: string): string {
    return DateValidationErrorMessages[dateType][key] || '';
  }
}
