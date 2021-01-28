import { NgModule } from '@angular/core';
import { TranslateDirective, TranslateLoader, TranslateModule, TranslatePipe, TranslateService } from '@ngx-translate/core';

import { TranslateMockPipe } from './translateMock.pipe';
import { TranslateMockDirective } from './translateMock.directive';
import { FakeLoader } from './fakeLoader';
import { TranslateStubService } from './translateStub.service';

@NgModule({
    declarations: [
        TranslateMockPipe,
        TranslateMockDirective
    ],
    providers: [
        { provide: TranslateService, useClass: TranslateStubService },
        { provide: TranslatePipe, useClass: TranslateMockPipe },
        { provide: TranslateDirective, useClass: TranslateMockDirective },
    ],
    imports: [
        TranslateModule.forRoot({
            loader: { provide: TranslateLoader, useClass: FakeLoader },
        })
    ],
    exports: [
        TranslateMockPipe,
        TranslateMockDirective
    ]
})
export class TranslateTestingModule { }
