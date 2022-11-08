import {Pipe, PipeTransform} from '@angular/core';

interface keyValue {
  key: string;
  value: any;
}

@Pipe({
  name: 'keyValue',
  pure: false
})
export class KeyValuePipe implements PipeTransform {
  transform(objectValue: object): keyValue[] {
    return Object.entries(objectValue).map(([key, value]) => ({key, value}));
  }
}
