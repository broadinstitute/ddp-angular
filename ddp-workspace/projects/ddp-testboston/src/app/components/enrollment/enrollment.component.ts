import { Component } from '@angular/core';
import { SessionMementoService } from 'ddp-sdk';
import { AppRoutes } from '../../app-routes';

@Component({
  selector: 'app-enrollment',
  templateUrl: './enrollment.component.html',
  styleUrls: ['./enrollment.component.scss']
})
export class EnrollmentComponent {
  public appRoutes = AppRoutes;

  constructor(private session: SessionMementoService) { }

  public get invitationId(): string {
    return this.session.session.invitationId;
  }

  public enroll(): void { }
}
