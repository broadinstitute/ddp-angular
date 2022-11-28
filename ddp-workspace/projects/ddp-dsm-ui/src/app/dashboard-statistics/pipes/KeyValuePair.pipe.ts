import {Pipe, PipeTransform} from '@angular/core';

interface KeyValuePair {
  key: string;
  value: any;
}

@Pipe({
  name: 'keyValuePair',
  pure: false
})
export class KeyValuePairPipe implements PipeTransform {
  transform(objectValue: object): KeyValuePair[] {
    return Object.entries(objectValue).map(([key, value]) => ({key, value}));
  }
}
