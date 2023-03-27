import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Result } from '../utils/result.model';
import { ComponentService } from '../services/component.service';
import { Statics } from '../utils/statics';
import { DSMService } from '../services/dsm.service';
import { Auth } from '../services/auth.service';
import { RoleService } from '../services/role.service';
import { EventType, ParticipantEvent } from './participant-event.model';

@Component({
  selector: 'app-participant-event',
  templateUrl: './participant-event.component.html',
  styleUrls: ['./participant-event.component.css']
})
export class ParticipantEventComponent implements OnInit {
  errorMessage: string;
  additionalMessage: string;
  loading = false;

  realm: string;

  possibleEvents: Array<EventType> = [];
  participantsSkipped: Array<ParticipantEvent> = [];
  event: string;

  participantId: string = null;
  allowedToSeeInformation = false;

  constructor(private dsmService: DSMService, private auth: Auth, private router: Router, private role: RoleService,
              private compService: ComponentService, private route: ActivatedRoute) {
    if (!auth.authenticated()) {
      auth.logout();
    }
    this.route.queryParams.subscribe(params => {
      this.realm = params[DSMService.REALM] || null;
      if (this.realm != null) {
        //        this.compService.realmMenu = this.realm;
        this.checkRight();
      }
    });
  }

  ngOnInit(): void {
    if (sessionStorage.getItem(ComponentService.MENU_SELECTED_REALM) != null) {
      this.realm = sessionStorage.getItem(ComponentService.MENU_SELECTED_REALM);
      this.checkRight();
    } else {
      this.additionalMessage = 'Please select a study';
    }
    window.scrollTo(0, 0);
  }

  private checkRight(): void {
    this.additionalMessage = null;
    this.allowedToSeeInformation = false;
    let jsonData: any[];
    this.dsmService.getRealmsAllowed(Statics.PARTICIPANT_EVENT).subscribe({
      next: data => {
        jsonData = data;
        jsonData.forEach((val) => {
          if (this.realm === val) {
            this.getListOfPossibleEvents();
            this.getSkippedParticipantEvents();
            this.allowedToSeeInformation = true;
          }
        });
        if (!this.allowedToSeeInformation) {
          this.additionalMessage = 'You are not allowed to see information of the selected study at that category';
        }
      },
      error: () => null
    });
  }

  getListOfPossibleEvents(): void {
    if (this.realm !== '') {
      this.errorMessage = null;
      this.additionalMessage = null;
      this.loading = true;
      let jsonData: any[];
      this.dsmService.getPossibleEventTypes(this.realm).subscribe({
        next: data => {
          this.possibleEvents = [];
          // console.info(`received: ${JSON.stringify(data, null, 2)}`);
          jsonData = data;
          jsonData.forEach((val) => {
            const type = EventType.parse(val);
            this.possibleEvents.push(type);
          });
          this.loading = false;
        },
        error: err => {
          if (err._body === Auth.AUTHENTICATION_ERROR) {
            this.auth.logout();
          }
          this.loading = false;
          this.errorMessage = 'Error - Loading list of event types\nPlease contact your DSM developer';
        }
      });
    }
  }

  triggerSkippingEvent(): void {
    if (this.realm !== '' && this.participantId !== '') {
      this.errorMessage = null;
      this.loading = true;
      const payload = {realm: this.realm, participantId: this.participantId, eventType: this.event, user: this.role.userID()};
      // console.log(JSON.stringify(triggerSurveyPayload));
      this.dsmService.skipEvent(JSON.stringify(payload)).subscribe({ // need to subscribe, otherwise it will not send!
        next: data => {
          // console.log(data);
          const result = Result.parse(data);
          if (result.code !== 200) {
            this.errorMessage = result.body;
          } else {
            this.errorMessage = 'Skipping Email for given participant';
            this.participantId = null;
            this.event = null;
            this.getSkippedParticipantEvents();
          }
          this.loading = false;
        },
        error: err => {
          // console.log(err);
          if (err._body === Auth.AUTHENTICATION_ERROR) {
            this.router.navigate([Statics.HOME_URL]);
          }
          this.errorMessage = 'Failed to skip email for given participant';
          this.loading = false;
        }
      });
    } else {
      this.errorMessage = 'Please select a study and a event type and enter the AltPID for the participant';
    }
  }

  getSkippedParticipantEvents(): void {
    if (this.realm != null) {
      this.errorMessage = null;
      this.additionalMessage = null;
      this.loading = true;
      let jsonData: any[];
      this.dsmService.getSkippedParticipantEvents(this.realm).subscribe({
        next: data => {
          this.participantsSkipped = [];
          jsonData = data;
          jsonData.forEach((val) => {
            const participant = ParticipantEvent.parse(val);
            this.participantsSkipped.push(participant);
          });
          // console.info(`${this.exitedParticipants.length} kit types received: ${JSON.stringify(data, null, 2)}`);
          this.loading = false;
        },
        error: err => {
          if (err._body === Auth.AUTHENTICATION_ERROR) {
            this.auth.logout();
          }
          this.loading = false;
          this.errorMessage = 'Error - Loading list of skipped participant events\nPlease contact your DSM developer';
        }
      });
    }
  }
}
