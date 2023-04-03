import { Component, OnInit } from '@angular/core';
import { Participant } from '../participant-list/participant-list.model';
import { DSMService } from '../services/dsm.service';
import { Auth } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ComponentService } from '../services/component.service';
import { MedicalRecord } from '../medical-record/medical-record.model';
import { Statics } from '../utils/statics';

@Component({
  selector: 'app-permalink',
  templateUrl: './permalink.component.html',
  styleUrls: [ './permalink.component.css' ]
})
export class PermalinkComponent implements OnInit {
  participant: Participant;
  medicalRecord: MedicalRecord;

  constructor(private router: Router, private route: ActivatedRoute, private dsmService: DSMService, private auth: Auth) {
    if (!auth.authenticated()) {
      auth.sessionLogout();
    }
  }

  ngOnInit(): void {
    let realm: string;
    this.route.queryParams.forEach((p) => {
      realm = p[ DSMService.REALM ];
    });
    if (this.router.url.indexOf('/participantList') > -1) {
      this.gotToParticipant(realm);
    }
    if (this.router.url.indexOf(Statics.MEDICALRECORD) > -1) {
      let participantId: string;
      let medicalRecordId: string;
      this.route.params.forEach((p) => {
        participantId = p[ 'participantid' ];
        medicalRecordId = p[ 'medicalrecordid' ];
      });
      this.goToMedicalRecord(participantId, medicalRecordId);
    }
  }

  public gotToParticipant(realm?: string): void {
    this.router.navigate([ '/participantList' ]);
  }

  public goToMedicalRecord(participantId: string, medicalRecordId: string): void {
    this.participant = null;
    this.medicalRecord = null;
    if (medicalRecordId != null && medicalRecordId !== '' && participantId != null && participantId !== '') {
      this.dsmService.getParticipant(participantId, sessionStorage.getItem(ComponentService.MENU_SELECTED_REALM)).subscribe({
        next: data => {
          // console.info(`participant data received: ${JSON.stringify(data, null, 2)}`);
          this.participant = Participant.parse(data);

          if (this.medicalRecord != null && this.participant != null) {
            this.router.navigate([ Statics.MEDICALRECORD_URL ]);
          }
        },
        error: err => {
          if (err._body === Auth.AUTHENTICATION_ERROR) {
            this.auth.sessionLogout();
          }
          // eslint-disable-next-line no-throw-literal
          throw 'Error loading institutions' + err;
        }
      });

      this.dsmService.getMedicalRecord(participantId, medicalRecordId).subscribe({
        next: data => {
          // console.info(`institution data received: ${JSON.stringify(data, null, 2)}`);
          this.medicalRecord = MedicalRecord.parse(data);

          if (this.medicalRecord != null && this.participant != null) {
            this.router.navigate([ Statics.MEDICALRECORD_URL ]);
          }
        },
        error: err => {
          if (err._body === Auth.AUTHENTICATION_ERROR) {
            this.auth.sessionLogout();
          }
          // eslint-disable-next-line no-throw-literal
          throw 'Error loading medical record data' + err;
        }
      });
    } else {
      this.router.navigate([ Statics.HOME_URL ]);
    }
  }
}
