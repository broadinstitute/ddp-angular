import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SurveyEditorComponent } from './components/survey-editor/survey-editor.component';
import { PexEditorSandboxComponent } from './components/pex-editor-sandbox/pex-editor-sandbox.component';


const routes: Routes = [
    {
      path: '',
      component: SurveyEditorComponent,
      pathMatch: 'full'
    },
    {
        path: 'pex-sandbox',
        component: PexEditorSandboxComponent,
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
