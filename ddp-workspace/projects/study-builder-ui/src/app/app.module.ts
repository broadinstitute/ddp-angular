import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

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
    TextQuestionBlockComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FlexLayoutModule,
      MatButtonModule,
      MatIconModule,
    MatSelectModule,
    BrowserAnimationsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
