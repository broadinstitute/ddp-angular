import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SurveyEditorComponent } from './components/survey-editor/survey-editor.component';


const routes: Routes = [{
  path: '',
  component: SurveyEditorComponent,
  pathMatch: 'full'
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
