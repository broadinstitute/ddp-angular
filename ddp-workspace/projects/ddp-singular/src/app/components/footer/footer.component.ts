import { Component } from '@angular/core';
import { Route } from '../../constants/route';
import { SessionMementoService } from 'ddp-sdk';


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  Route = Route;
  readonly STUDY_PROGRESS_URL = 'https://www.additionalventures.org/project-singular-study-updates';
  readonly CURRENT_YEAR = new Date().getFullYear();

  constructor(
    private readonly sessionService: SessionMementoService
  ) {}

  get isAuthenticated(): boolean {
    return this.sessionService.isAuthenticatedSession();
  }
}
