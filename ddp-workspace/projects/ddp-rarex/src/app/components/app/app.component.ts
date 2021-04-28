import { Component, HostListener } from '@angular/core';

import { SessionMementoService } from 'ddp-sdk';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private sessionService: SessionMementoService) {}

  @HostListener('window:beforeunload')
  private beforeUnload(): void {
    this.sessionService.setParticipant(null);
  }
}
