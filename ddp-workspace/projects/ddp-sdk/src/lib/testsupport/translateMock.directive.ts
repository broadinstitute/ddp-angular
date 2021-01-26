import { AfterViewChecked, Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[translate],[ngx-translate]'
})
export class TranslateMockDirective implements AfterViewChecked {
  @Input() translateParams: any;

  constructor(private readonly _element: ElementRef) {
    console.log('TranslatePipeMock created');
  }

  ngAfterViewChecked(): void {
    this._element.nativeElement.innerText += 'i18n';
  }
}
