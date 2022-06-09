import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { AuditTrailRoutingModule } from "./audit-trail-routing.module";
import { AuditTrailComponent } from "./pages/audit-trail.component";
import { DropdownSelectComponent } from "./components/dropdown-select/dropdown-select.component";
import { MatIconModule } from "@angular/material/icon";

@NgModule({
  declarations: [AuditTrailComponent, DropdownSelectComponent],
  imports: [CommonModule, AuditTrailRoutingModule, MatIconModule],
})
export class AuditTrailModule {}
