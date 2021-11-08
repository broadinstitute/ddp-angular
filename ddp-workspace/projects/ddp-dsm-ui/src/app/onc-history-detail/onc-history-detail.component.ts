import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { interval } from 'rxjs';

import { Participant } from '../participant-list/participant-list.model';
import { OncHistoryDetail } from './onc-history-detail.model';
import { DSMService } from '../services/dsm.service';
import { ComponentService } from '../services/component.service';
import { RoleService } from '../services/role.service';
import { Utils } from '../utils/utils';
import { ModalComponent } from '../modal/modal.component';
import { Tissue } from '../tissue/tissue.model';
import { NameValue } from '../utils/name-value.model';
import { Statics } from '../utils/statics';
import { Auth } from '../services/auth.service';
import { Result } from '../utils/result.model';
import { PatchUtil } from '../utils/patch.model';

@Component({
  selector: 'app-onc-history-detail',
  templateUrl: './onc-history-detail.component.html',
  styleUrls: [ './onc-history-detail.component.css' ]
})
export class OncHistoryDetailComponent implements OnInit {
  @ViewChild(ModalComponent)
  public oncHisNoteModal: ModalComponent;

  @Input() participant: Participant;
  @Input() settings: {};
  @Input() oncHistory: Array<OncHistoryDetail> = [];
  @Input() oncHistoryId: string;
  @Input() editable = true;

  @Output() valueChangedEmit = new EventEmitter();
  @Output() triggerReload = new EventEmitter();
  @Output() selectionChanged = new EventEmitter();
  @Output() valuesSaved = new EventEmitter();
  @Output() openTissue = new EventEmitter();

  participantExited = true;

  oncHistoryDetail: OncHistoryDetail;
  showTissue = false;

  indexForNote: number;
  note: string;
  triggerSort = 0;

  currentPatchField: string;
  currentPatchFieldRow: number;
  patchFinished = true;

  constructor(private dsmService: DSMService, private compService: ComponentService, private role: RoleService,
               private router: Router, private util: Utils) {
  }

  ngOnInit(): void {
    this.triggerSort = this.triggerSort + 1;
    if (this.participant.data.status === undefined || this.participant.data.status.indexOf(Statics.EXITED) === -1) {
      this.participantExited = false;
    }
  }

  valueChanged(value: any, parameterName: string, index: number): void {
    let v;

    if (typeof value === 'string') {
      this.oncHistory[ index ][ parameterName ] = value;
      v = value;
    } else if (value != null) {
      if (value.srcElement != null && typeof value.srcElement.value === 'string') {
        v = value.srcElement.value;
        if (parameterName === 'destructionPolicy') {
          if (this.isError(v)) {
            this.patchFinished = false;
            this.currentPatchField = parameterName;
            return;
          }
        }
      } else if (value.value != null) {
        v = value.value;
      } else if (value.checked != null) {
        v = value.checked;
      } else if (typeof value === 'object') {
        v = JSON.stringify(value);
      }
    }
    if (v != null) {
      const realm: string = localStorage.getItem(ComponentService.MENU_SELECTED_REALM);
      const patch1 = new PatchUtil(
        this.oncHistory[index].oncHistoryDetailId, this.role.userMail(),
        {
          name: parameterName,
          value: v
        }, null, 'participantId', this.participant.participant.participantId,
        Statics.ONCDETAIL_ALIAS, null, realm, this.participant.participant.ddpParticipantId
      );
      const patch = patch1.getPatch();
      this.patchFinished = false;
      this.currentPatchField = parameterName;
      this.currentPatchFieldRow = index;
      if (patch1.id == null && this.editable) {
        this.editable = false;
      }
      this.patch(patch, index);
    }
    if (index === this.oncHistory.length - 1) {
      this.addNewOncHistory(this.participant.participant.participantId);
    }
  }

  multipleValueChanged(patch: any, index: number, parameterName: string): void {
    this.patchFinished = false;
    this.currentPatchField = parameterName;
    this.currentPatchFieldRow = index;
    if (this.oncHistory[ index ].oncHistoryDetailId != null) {
      // do normal patch because oncHistoryDetailId is already set
      this.patch(patch, index);
    } else {
      const subscription = interval(250).subscribe(n => {
        if (this.oncHistory[ index ].oncHistoryDetailId != null) {
          subscription.unsubscribe();
          patch.id = this.oncHistory[ index ].oncHistoryDetailId;
          this.patch(patch, index);
        }
      });
    }

    if (index === this.oncHistory.length - 1) {
      this.addNewOncHistory(this.participant.participant.participantId);
    }
  }

  patch(patch: any, index: number): void {
    this.dsmService.patchParticipantRecord(JSON.stringify(patch)).subscribe(// need to subscribe, otherwise it will not send!
      data => {
        const result = Result.parse(data);
        if (result.code === 200 && result.body != null && result.body !== '') {
          const jsonData: any | any[] = JSON.parse(result.body);
          if (jsonData instanceof Array) {
            jsonData.forEach((val) => {
              const nameValue = NameValue.parse(val);
              if (nameValue.name === 'createdOncHistory') {
                this.participant.participant[ 'createdOncHistory' ] = nameValue.value;
              } else {
                this.oncHistory[ index ][ nameValue.name ] = nameValue.value;
              }
            });
          } else {
            this.oncHistory[ index ].oncHistoryDetailId = jsonData.oncHistoryDetailId;
            if (!this.editable) {
              this.editable = true;
            }
            // set oncHistoryDetailId to tissue as well
            for (const tissue of this.oncHistory[ index ].tissues) {
              tissue.oncHistoryDetailId = this.oncHistory[ index ].oncHistoryDetailId;
            }
            // set other workflow fieldValue
            if (jsonData.NameValue != null) {
              const innerJson: any | any[] = JSON.parse(jsonData.NameValue);
              // should be only needed for setting oncHistoryDetails on pt level to created
              if (innerJson instanceof Array) {
                innerJson.forEach((val) => {
                  const nameValue = NameValue.parse(val);
                  if (nameValue.name === 'createdOncHistory') {
                    this.participant.participant[ nameValue.name ] = nameValue.value;
                  } else {
                    this.oncHistory[ index ][ nameValue.name ] = nameValue.value;
                  }
                });
              }
            }
          }
        }
        this.patchFinished = true;
        this.currentPatchField = null;
        this.currentPatchFieldRow = null;
      },
      err => {
        if (err._body === Auth.AUTHENTICATION_ERROR) {
          this.router.navigate([ Statics.HOME_URL ]);
        }
      }
    );
  }

  onRequestChange(index: number): void {
    this.valueChanged(this.oncHistory[ index ].request, 'request', index);
  }

  // add additional value to oncHistoryDetails
  onAdditionalColChange(evt: any, index: number, colName: string): void {
    let v;
    if (typeof evt === 'string') {
      v = evt;
    } else {
      if (evt.srcElement != null && typeof evt.srcElement.value === 'string') {
        v = evt.srcElement.value;
      } else if (evt.value != null) {
        v = evt.value;
      } else if (evt.checked != null) {
        v = evt.checked;
      }
    }
    if (v !== null) {
      if (this.oncHistory[ index ].additionalValues != null) {
        this.oncHistory[ index ].additionalValues[ colName ] = v;
      } else {
        const addArray = {};
        addArray[ colName ] = v;
        this.oncHistory[ index ].additionalValues = addArray;
      }
      this.valueChanged(this.oncHistory[ index ].additionalValues, 'additionalValues', index);
      if (index === this.oncHistory.length - 1) {
        this.addNewOncHistory(this.oncHistory[ index ].participantId);
      }
    }
  }

  // display additional value
  getAdditionalValue(index: number, colName: string): string {
    if (this.oncHistory[ index ].additionalValues != null && this.oncHistory[ index ].additionalValues[ colName ] != null) {
      return this.oncHistory[ index ].additionalValues[ colName ];
    }
    return null;
  }

  addNewOncHistory(participantId: string): void {
    const tissues: Array<Tissue> = [];
    tissues.push(new Tissue(null, null, null, null, null, null,
      null, null, null, null, null, null, null, null,
      null, null, null, null, null, null, null,
      null, null, null, null, null, null));
    this.oncHistory.push(new OncHistoryDetail(participantId, null, null, null, null,
      null, null, null, null, null, null, null, null,
      null, null, null, null, null, null, null, null, null,
      null, null, null, tissues,
      null, null, null, null));
  }

  deleteOncHistory(index: number): void {
    this.oncHistory[ index ].deleted = true;
    const realm: string = localStorage.getItem(ComponentService.MENU_SELECTED_REALM);
    const patch1 = new PatchUtil(
      this.oncHistory[index].oncHistoryDetailId, this.role.userMail(),
      {
        name: 'deleted',
        value: true
      }, null, 'participantId', this.oncHistory[index].participantId,
      Statics.ONCDETAIL_ALIAS, null, realm, this.participant.participant.ddpParticipantId
    );
    const patch = patch1.getPatch();
    this.patchFinished = false;
    this.dsmService.patchParticipantRecord(JSON.stringify(patch)).subscribe(// need to subscribe, otherwise it will not send!
      data => {
        const result = Result.parse(data);
        if (result.code === 200) {
          this.oncHistory.splice(index, 1);
        }
        this.patchFinished = true;
        this.currentPatchField = null;
      },
      err => {
        if (err._body === Auth.AUTHENTICATION_ERROR) {
          this.router.navigate([ Statics.HOME_URL ]);
        }
      }
    );

    this.triggerReload.next(true);

    if (index === this.oncHistory.length - 1) {
      this.addNewOncHistory(this.oncHistory[ index ].participantId);
    }
  }

  openTissuePage(oncHis: OncHistoryDetail): void {
    if (oncHis != null) {
      this.oncHistoryDetail = oncHis;
      // tslint:disable-next-line:max-line-length
      this.compService.editable = ((oncHis.request === 'sent') || (oncHis.request === 'received') || (oncHis.request === 'returned') || (oncHis.request === 'unableToObtain'));
      this.showTissue = true;
      this.openTissue.emit(oncHis);
    }
  }

  selected(): void {
    this.selectionChanged.next(true);
  }

  openNoteModal(index: number): void {
    this.indexForNote = index;
    this.note = this.oncHistory[ this.indexForNote ].oncHisNotes;
  }

  saveNote(): void {
    this.oncHistory[ this.indexForNote ].oncHisNotes = this.note;
    this.valueChanged(this.note, 'oncHisNotes', this.indexForNote);
  }

  setFacility(contact: any, index: number): void {
    const realm: string = localStorage.getItem(ComponentService.MENU_SELECTED_REALM);
    if (contact != null) {
      if (event instanceof MouseEvent) {
        this.oncHistory[ index ].facility = contact.field1.value;
        if (contact.field3 != null) {
          this.oncHistory[ index ].fPhone = contact.field3.value;
        }
        if (contact.field4 != null) {
          this.oncHistory[ index ].fFax = contact.field4.value;
        }
        if (contact.field5 != null) {
          this.oncHistory[ index ].destructionPolicy = contact.field5.value;
        }
        const nameValues = [ {name: 'oD.facility', value: contact.field1.value}, {
          name: 'oD.fPhone',
          value: contact.field3.value
        }, {
          name: 'oD.fFax', value: contact.field4.value
        }, {name: 'oD.destructionPolicy', value: contact.field5.value} ];
        const patch1 = new PatchUtil(
          this.oncHistory[ index ].oncHistoryDetailId, this.role.userMail(),
          null, nameValues, 'participantId', this.oncHistory[ index ].participantId,
          Statics.ONCDETAIL_ALIAS, null, realm, this.participant.participant.ddpParticipantId
        );
        const patch = patch1.getPatch();
        this.multipleValueChanged(patch, index, 'facility');
      } else {
        this.oncHistory[ index ].facility = contact;
        const patch1 = new PatchUtil(
          this.oncHistory[ index ].oncHistoryDetailId, this.role.userMail(),
          {
            name: 'facility',
            value: contact
          }, null, 'participantId', this.oncHistory[ index ].participantId,
          Statics.ONCDETAIL_ALIAS, null, realm, this.participant.participant.ddpParticipantId
        );
        const patch = patch1.getPatch();
        this.patchFinished = false;
        this.currentPatchField = 'facility';
        this.currentPatchFieldRow = index;
        this.patch(patch, index);
      }
    }
  }

  public setTypePx(object: any, index: number): void {
    if (object != null) {
      if (event instanceof MouseEvent) {
        // slow save to make sure value is saved to right value
        this.oncHistory[ index ].typePX = object.field1.value;
        const realm: string = localStorage.getItem(ComponentService.MENU_SELECTED_REALM);
        const patch1 = new PatchUtil(
          this.oncHistory[ index ].oncHistoryDetailId, this.role.userMail(),
          {
            name: 'typePX',
            value: object.field1.value
          }, null, 'participantId', this.oncHistory[ index ].participantId,
          Statics.ONCDETAIL_ALIAS, null, realm, this.participant.participant.ddpParticipantId
        );
        const patch = patch1.getPatch();
        this.multipleValueChanged(patch, index, 'typePX');
      } else {
        this.oncHistory[ index ].typePX = object;
        this.valueChanged(this.oncHistory[ index ].typePX, 'typePX', index);
      }
    }
  }

  public setHistology(object: any, index: number): void {
    if (object != null) {
      if (event instanceof MouseEvent) {
        // slow save to make sure value is saved to right value
        this.oncHistory[ index ].histology = object.field1.value;
        const realm: string = localStorage.getItem(ComponentService.MENU_SELECTED_REALM);
        const patch1 = new PatchUtil(
          this.oncHistory[ index ].oncHistoryDetailId, this.role.userMail(),
          {
            name: 'histology',
            value: object.field1.value
          }, null, 'participantId', this.oncHistory[ index ].participantId,
          Statics.ONCDETAIL_ALIAS, null, realm, this.participant.participant.ddpParticipantId
        );
        const patch = patch1.getPatch();
        this.multipleValueChanged(patch, index, 'histology');
      } else {
        this.oncHistory[ index ].histology = object;
        this.valueChanged(this.oncHistory[ index ].histology, 'histology', index);
      }
    }
  }

  getUtil(): Utils {
    return this.util;
  }

  getRole(): RoleService {
    return this.role;
  }

  getNoteButtonColorStyle(s: string): string {
    if (s != null && s !== '') {
      return Statics.COLOR_PRIMARY;
    }
    return Statics.COLOR_BASIC;
  }

  isPatchedCurrently(field: string, row: number): boolean {
    return this.currentPatchField === field && this.currentPatchFieldRow === row;
  }

  currentField(field: string, row: number): void {
    if (field != null || (field == null && this.patchFinished)) {
      this.currentPatchField = field;
      this.currentPatchFieldRow = row;
    }
  }

  isError(v): boolean {
    return v !== 'indefinitely' && isNaN(v) && v != null && v !== '';
  }
}
