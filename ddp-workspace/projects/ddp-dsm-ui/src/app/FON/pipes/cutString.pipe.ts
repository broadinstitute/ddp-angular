import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'cutString'
})

export class CutStringPipe implements PipeTransform {
  transform(value: string, from: number = 17, trail = '...'): string {
    return value.length > from ? value.substring(0, from) + trail : value;
  }
}
