// todo try to find better solution with injecting monaco type declaration
// eslint-disable-next-line
/// <reference path="../../../../node_modules/monaco-editor/monaco.d.ts" />
import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, ErrorHandler, Injector, NgModule } from '@angular/core';
import { EditorModule } from '@tinymce/tinymce-angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SurveyCanvasComponent } from './components/survey-canvas/survey-canvas.component';
import { SurveyComponentEditorComponent } from './components/survey-component-editor/survey-component-editor.component';
import { SurveyComponentPaletteComponent } from './components/survey-component-palette/survey-component-palette.component';
import { SurveyEditorComponent } from './components/survey-editor/survey-editor.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivityComponent } from './components/activity/activity.component';
import { SectionComponent } from './components/section/section.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ContentBlockComponent } from './components/content-block/content-block.component';
import { TextQuestionBlockComponent } from './components/text-question-block/text-question-block.component';
import { TextQuestionEditorComponent } from './components/text-question-editor/text-question-editor.component';
import { PicklistQuestionBlockComponent } from './components/picklist-question-block/picklist-question-block.component';
import { PicklistQuestionEditorComponent } from './components/picklist-question-editor/picklist-question-editor.component';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ConfigurationService, DdpModule, LanguageService, LoggingService, StudiesServiceAgentService } from 'ddp-sdk';
import { DummyErrorHandler } from './dummyErrorHandler';
import { StaticContentBlockComponent } from './components/static-content-block/static-content-block.component';
import { StaticContentBlockEditorComponent } from './components/static-content-block-editor/static-content-block-editor.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ManageListComponent } from './components/manage-list/manage-list.component';
import { PicklistOptionEditorComponent } from './components/picklist-option-editor/picklist-option-editor.component';
import { PicklistOptionsListComponent } from './components/picklist-options-list/picklist-options-list.component';
import { PicklistGroupEditorComponent } from './components/picklist-group-editor/picklist-group-editor.component';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { LOCATION_INITIALIZED } from '@angular/common';
import { DummyLoggingService } from './dummyLoggingService';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ResizableModule } from 'angular-resizable-element';
import { PexEditorSandboxComponent } from './components/pex-editor-sandbox/pex-editor-sandbox.component';
import { PexEditorComponent } from './components/pex-editor/pex-editor.component';
import { MonacoEditorModule, NGX_MONACO_EDITOR_CONFIG, NgxMonacoEditorConfig } from 'ngx-monaco-editor';
import { PEXLanguage } from '../antlr4-pex-grammar/pex-config';
import { PexTokensProvider } from './monaco-providers/pex-tokens-provider';
import { pexTheme } from './monaco-providers/pex-theme';
import { pexProvideCompletionItems } from './monaco-providers/pex-completion-item-provider';
import { ValidatorsBlockComponent } from './components/validators-block/validators-block.component';

const ddpConfig = new ConfigurationService();
ddpConfig.doGcpErrorReporting = false;
ddpConfig.tooltipIconUrl = 'assets/images/info.png';

export function translateFactory(translate: TranslateService,
                                 injector: Injector,
                                 language: LanguageService): () => Promise<any> {
    return () => new Promise<any>((resolve: any) => {
        const LOG_SOURCE = 'AppModule';
        const locationInitialized = injector.get(LOCATION_INITIALIZED, Promise.resolve(null));
        locationInitialized.then(() => {
            const locale = language.getAppLanguageCode();
            translate.setDefaultLang(locale);
            translate.use(locale).subscribe({
                next: () => {
                    console.log(LOG_SOURCE, `Successfully initialized '${locale}' language as default.`);
                },
                error: err => {
                    console.error(LOG_SOURCE, `Problem with '${locale}' language initialization:`, err);
                },
                complete: () => {
                    resolve(null);
                }
            });
        });
    });
}

function createTranslateLoader(handler: HttpBackend): TranslateHttpLoader {
    const http = new HttpClient(handler);
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

function onMonacoLoad(studiesServiceAgent: StudiesServiceAgentService): void {
    monaco.languages.register({id: PEXLanguage});
    monaco.languages.setTokensProvider(PEXLanguage, new PexTokensProvider());
    monaco.editor.defineTheme('ddp-theme', pexTheme);

    const pexCompletionItemProvider: monaco.languages.CompletionItemProvider = {
        provideCompletionItems: (model: monaco.editor.ITextModel, position: monaco.Position) =>
            pexProvideCompletionItems(model, position, studiesServiceAgent)
    };
    monaco.languages.registerCompletionItemProvider(PEXLanguage, pexCompletionItemProvider);
}

@NgModule({
    declarations: [
        AppComponent,
        SurveyCanvasComponent,
        SurveyComponentEditorComponent,
        SurveyComponentPaletteComponent,
        SurveyEditorComponent,
        ActivityComponent,
        SectionComponent,
        ContentBlockComponent,
        TextQuestionBlockComponent,
        TextQuestionEditorComponent,
        PicklistQuestionBlockComponent,
        PicklistQuestionEditorComponent,
        StaticContentBlockComponent,
        StaticContentBlockEditorComponent,
        ManageListComponent,
        PicklistOptionEditorComponent,
        PicklistOptionsListComponent,
        PicklistGroupEditorComponent,
        PexEditorComponent,
        PexEditorSandboxComponent,
        ValidatorsBlockComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        EditorModule,
        FlexLayoutModule,
        MatButtonModule,
        MatIconModule,
        MatSelectModule,
        MatInputModule,
        MatRadioModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MatCheckboxModule,
        DdpModule,
        DragDropModule,
        FormsModule,
        DragDropModule,
        ResizableModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpBackend],
            },
        }),
        MonacoEditorModule.forRoot(),
    ],
    providers: [
        {
            provide: 'ddp.config',
            useValue: ddpConfig
        },
        {
            provide: ErrorHandler,
            useClass: DummyErrorHandler
        },
        {
            provide: LoggingService,
            useClass: DummyLoggingService
        },
        {
            provide: APP_INITIALIZER,
            useFactory: translateFactory,
            deps: [
                TranslateService,
                Injector,
                LanguageService
            ],
            multi: true
        },
        {
            provide: NGX_MONACO_EDITOR_CONFIG,
            useFactory: (studiesServiceAgent: StudiesServiceAgentService) => {
                const monacoConfig: NgxMonacoEditorConfig = {
                    onMonacoLoad: () => onMonacoLoad(studiesServiceAgent)
                };
                return monacoConfig;
            },
            deps: [StudiesServiceAgentService]
        }
    ],
    bootstrap: [AppComponent]
})

export class AppModule { }
