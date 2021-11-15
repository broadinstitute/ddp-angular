import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
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
import { ConfigurationService, DdpModule } from 'ddp-sdk';
import { DummyErrorHandler } from './dummyErrorHandler';
import { StaticContentBlockComponent } from './components/static-content-block/static-content-block.component';
import { StaticContentBlockEditorComponent } from './components/static-content-block-editor/static-content-block-editor.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ManageListComponent } from './components/manage-list/manage-list.component';
import { PicklistOptionEditorComponent } from './components/picklist-option-editor/picklist-option-editor.component';
import { PicklistOptionsListComponent } from './components/picklist-options-list/picklist-options-list.component';
import { PicklistGroupEditorComponent } from './components/picklist-group-editor/picklist-group-editor.component';

const ddpConfig = new ConfigurationService();
ddpConfig.doGcpErrorReporting = false;
ddpConfig.tooltipIconUrl = 'assets/images/info.png';

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
        PicklistGroupEditorComponent
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
        FormsModule
    ],
    providers: [
        {
            provide: 'ddp.config',
            useValue: ddpConfig
        }
        ,
        {
            provide: ErrorHandler,
            useClass: DummyErrorHandler
        }],
    bootstrap: [AppComponent]
})

export class AppModule { }
