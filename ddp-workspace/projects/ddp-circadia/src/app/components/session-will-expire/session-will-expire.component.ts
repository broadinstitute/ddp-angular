import { Component } from '@angular/core';

import { SessionWillExpireComponent as ToolkitSessionWillExpireComponent } from 'toolkit';

@Component({
  selector: 'app-session-will-expire',
  templateUrl: './session-will-expire.component.html',
  styleUrls: ['./session-will-expire.component.scss'],
})
export class SessionWillExpireComponent extends ToolkitSessionWillExpireComponent {}
