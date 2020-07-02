import {
    AfterViewChecked,
    Directive,
    ElementRef,
    Injectable,
    Input,
    NgModule,
    Pipe,
    PipeTransform
} from '@angular/core';
import { TranslateDirective, TranslateLoader, TranslateModule, TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';


const translations: any = {};

class FakeLoader implements TranslateLoader {
    getTranslation(lang: string): Observable<any> {
        return of(translations);
    }
}

@Directive({
    selector: '[translate],[ngx-translate]'
})
export class TranslateMockDirective implements AfterViewChecked {
    @Input()
    translateParams: any;

    constructor(private readonly _element: ElementRef) {
        console.log('TranslatePipeMock created');
    }

    ngAfterViewChecked(): void {
        this._element.nativeElement.innerText += 'i18n';
    }
}

@Pipe({
    name: 'translate'
})
export class TranslatePipeMock implements PipeTransform {
    public name = 'translate';

    public transform(query: string, ...args: any[]): any {
        return query;
    }
    public constructor() {
        console.log('TranslatePipeMock created');
    }
}

@Injectable()
export class TranslateServiceStub {
    public get<T>(key: T): Observable<T> {
        return of(key);
    }
}

@NgModule({
    declarations: [
        TranslatePipeMock,
        TranslateMockDirective
    ],
    providers: [
        { provide: TranslateService, useClass: TranslateServiceStub },
        { provide: TranslatePipe, useClass: TranslatePipeMock },
        { provide: TranslateDirective, useClass: TranslateMockDirective },
    ],
    imports: [
        TranslateModule.forRoot({
            loader: { provide: TranslateLoader, useClass: FakeLoader },
        })
    ],
    exports: [
        TranslatePipeMock,
        TranslateMockDirective
    ]
})
export class TranslateTestingModule {

}
