import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

import { ParticipantUpdateResultDialogComponent } from '../../dialogs/participant-update-result-dialog.component';
import { ParticipantData } from '../../participant-list/models/participant-data.model';
import { ComponentService } from '../../services/component.service';
import { DSMService } from '../../services/dsm.service';
import { RoleService } from '../../services/role.service';
import { Statics } from '../../utils/statics';

@Component({
  selector: 'app-add-family-member',
  templateUrl: './add-family-member.component.html',
  styleUrls: ['./add-family-member.component.css']
})
export class AddFamilyMemberComponent implements OnInit {
  familyMemberFirstName: string;
  familyMemberLastName: string;
  familyMemberSubjectId: string;
  chosenRelation: string;
  isCopyProbandInfo = false;
  probandDataId: number = this.getProbandDataId(this.data.participant.participantData);
  isParticipantProbandEmpty: boolean = this.getProbandDataId(this.data.participant.participantData) == null;
  staticRelations = Statics.RELATIONS;
  isDataLoading = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: {participant: any}, private dsmService: DSMService,
              private compService: ComponentService, private role: RoleService, public dialog: MatDialog,
              private dialogRef: MatDialogRef<AddFamilyMemberComponent>) { }

  ngOnInit(): void {
    this.dsmService.getParticipantDsmData(this.compService.getRealm(), this.getAltPidElseGuid()).subscribe(
      data => {
        if (data != null) {
          const participantData = data;
          this.isParticipantProbandEmpty = this.getProbandDataId(participantData) == null;
          if (!this.isParticipantProbandEmpty) {
            this.probandDataId = this.getProbandDataId(participantData);
          }
        }
      }
    );
  }

  isFamilyMemberFieldsEmpty(): boolean {
    return !this.familyMemberFirstName || !this.familyMemberLastName || !this.familyMemberSubjectId || !this.chosenRelation;
  }

  submitFamilyMember(): void {
    const payload = {
      participantId: this.getAltPidElseGuid(),
      realm: this.compService.getRealm(),
      data: {
        firstName: this.familyMemberFirstName,
        lastName: this.familyMemberLastName,
        memberType: this.chosenRelation,
        subjectId: this.familyMemberSubjectId
      },
      copyProbandInfo: this.isCopyProbandInfo,
      probandDataId: this.probandDataId,
      userId: this.role.userID()
    };
    this.isDataLoading = true;
    this.dsmService.addFamilyMemberRequest(JSON.stringify(payload)).subscribe({
      next: data => {
        this.openResultDialog('Successfully added family member');
        this.close();
        this.data.participant.participantData.push(data);
      },
      error: err => {
        if (err.status === 400) {
          const result = JSON.parse(err._body);
          this.openResultDialog(result.body);
        } else {
          this.openResultDialog('Error - Adding family member \nPlease contact your DSM Developer');
        }
        this.close();
      },
    });
  }

  private openResultDialog(text: string): void {
    this.isDataLoading = false;
    this.dialog.open(ParticipantUpdateResultDialogComponent, {
      data: { message: text },
    });
  }

  close(): void {
    this.dialogRef.close();
  }

  getRelations(): string[] {
    let relations = Object.keys(Statics.RELATIONS);
    if (!this.isParticipantProbandEmpty) {
      relations = relations.filter(rel => rel !== Statics.PARTICIPANT_PROBAND);
    }
    return relations;
  }

  getProbandDataId(pData: Array<ParticipantData>): number {
    let ddpParticipantDataId;
    const probandData = pData
          .filter(p => p.data['MEMBER_TYPE'] === Statics.PARTICIPANT_PROBAND)
          .shift();
    if (probandData != null && probandData.hasOwnProperty('dataId')) {
      ddpParticipantDataId = probandData['dataId'];
    }
    return ddpParticipantDataId;
  }

  isRelationshipIdExists(): boolean {
    const relationshipIds: Array<string> = this.data.participant.participantData.map(pData => {
      const familyMemberData = pData.data;
      if (familyMemberData.hasOwnProperty(Statics.PARTICIPANT_RELATIONSHIP_ID)) {
        const firstUnderScore = familyMemberData[Statics.PARTICIPANT_RELATIONSHIP_ID].indexOf('_');
        const secondUnderScore = familyMemberData[Statics.PARTICIPANT_RELATIONSHIP_ID].indexOf('_', firstUnderScore + 1);
        return familyMemberData[Statics.PARTICIPANT_RELATIONSHIP_ID].substring(secondUnderScore + 1);
      }
      return '';
    });
    return relationshipIds.includes(this.familyMemberSubjectId);
  }

  getAltPidElseGuid(): any {
    let participantId = this.data.participant.data.profile['legacyAltPid'];
    if (!participantId) {
      participantId = this.data.participant.data.profile['guid'];
    }
    return participantId;
  }
}
