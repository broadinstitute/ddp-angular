import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuditTrailRoutingModule } from './audit-trail-routing.module';
import { AuditTrailComponent } from './pages/audit-trail.component';


@NgModule({
  declarations: [
    AuditTrailComponent
  ],
  imports: [
    CommonModule,
    AuditTrailRoutingModule
  ]
})
export class AuditTrailModule { }
