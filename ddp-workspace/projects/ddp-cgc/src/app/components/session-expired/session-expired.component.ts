import { Component } from '@angular/core';
import { SessionExpiredComponent as ToolkitSessionExpiredComponent } from 'toolkit';


@Component({
  selector: 'app-session-expired',
  templateUrl: './session-expired.component.html',
  styleUrls: ['./session-expired.component.scss']
})
export class SessionExpiredComponent extends ToolkitSessionExpiredComponent {}
