import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudyActGuard } from "../guards/studyAct.guard";
import { AuditTrailComponent } from "./pages/audit-trail.component";

const routes: Routes = [
  {
    path: "",
    component: AuditTrailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuditTrailRoutingModule { }
