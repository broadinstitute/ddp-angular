import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { EditorModule } from '@tinymce/tinymce-angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SurveyCanvasComponent } from './survey-canvas/survey-canvas.component';
import { SurveyComponentEditorComponent } from './survey-component-editor/survey-component-editor.component';
import { SurveyComponentPaletteComponent } from './survey-component-palette/survey-component-palette.component';
import { SurveyEditorComponent } from './survey-editor/survey-editor.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivityComponent } from './activity/activity.component';
import { SectionComponent } from './section/section.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ContentBlockComponent } from './content-block/content-block.component';
import { TextQuestionBlockComponent } from './text-question-block/text-question-block.component';
import { TextQuestionEditorComponent } from './text-question-editor/text-question-editor.component';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';

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
    TextQuestionEditorComponent
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
    MatCheckboxModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
