import { Component, Input } from '@angular/core';
import { InvitationData } from './invitation-data.model';

@Component({
  selector: 'app-invitation-data',
  templateUrl: './invitation-data.component.html',
  styleUrls: ['./invitation-data.component.css']
})
export class InvitationDataComponent {
  @Input() invitation: InvitationData;
}
