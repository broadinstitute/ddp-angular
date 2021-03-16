import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'translate'
})
export class TranslateMockPipe implements PipeTransform {
  public name = 'translate';

  public constructor() {
    console.log('TranslatePipeMock created');
  }

  public transform(query: string, ...args: any[]): any {
    return query;
  }
}
