import { Component, HostListener } from '@angular/core';

import { SessionMementoService } from 'ddp-sdk';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private sessionService: SessionMementoService) {
    this.resetParticipant();
  }

  @HostListener('window:beforeunload')
  private resetParticipant(): void {
    this.sessionService.setParticipant(null);
  }
}
