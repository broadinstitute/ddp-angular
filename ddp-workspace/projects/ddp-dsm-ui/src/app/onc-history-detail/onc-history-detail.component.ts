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
import { PatchUtil } from '../utils/patch.model';
import { Lookup } from '../lookup/lookup.model';

@Component({
  selector: 'app-onc-history-detail',
  templateUrl: './onc-history-detail.component.html',
  styleUrls: [ './onc-history-detail.component.scss' ]
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
  errorMessage: string;

  constructor(private dsmService: DSMService, private compService: ComponentService, private role: RoleService,
               private router: Router, private util: Utils, private auth: Auth) {
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
      let ddpParticipantId = this.participant.data.profile['guid'];
      if (this.participant.data.profile['legacyAltPid']) {
        ddpParticipantId = this.participant.data.profile['legacyAltPid'];
      }
      const realm: string = sessionStorage.getItem(ComponentService.MENU_SELECTED_REALM);
      const patch1 = new PatchUtil(
        this.oncHistory[index].oncHistoryDetailId, this.role.userMail(),
        {
          name: parameterName,
          value: v
        }, null, 'participantId', this.participant.participant.participantId,
        Statics.ONCDETAIL_ALIAS, null, realm, ddpParticipantId
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
      const subscription = interval(250).subscribe(() => {
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
    this.dsmService.patchParticipantRecord(JSON.stringify(patch)).subscribe({ // need to subscribe, otherwise it will not send!
      next: data => {
        this.errorMessage = null;
        if (data instanceof Array) {
        data.forEach( ( val ) => {
              const nameValue = NameValue.parse(val);
              if (nameValue.name === 'created') {
                this.participant.participant[ 'created' ] = nameValue.value;
              } else {
                this.oncHistory[ index ][ nameValue.name ] = nameValue.value;
              }
            });
          } else {
            this.oncHistory[ index ].oncHistoryDetailId = data['oncHistoryDetailId'];
            if (!this.editable) {
              this.editable = true;
            }
            // set oncHistoryDetailId to tissue as well
            for (const tissue of this.oncHistory[ index ].tissues) {
              tissue.oncHistoryDetailId = this.oncHistory[ index ].oncHistoryDetailId;
            }
            // set other workflow fieldValue
          if (data['NameValue'] != null) {
            const innerJson: any | any[] = JSON.parse( data['NameValue'] );
              // should be only needed for setting oncHistoryDetails on pt level to created
              if (innerJson instanceof Array) {
                innerJson.forEach((val) => {
                  const nameValue = NameValue.parse(val);
                  if (nameValue.name === 'created') {
                    this.participant.participant[ nameValue.name ] = nameValue.value;
                  } else {
                    this.oncHistory[ index ][ nameValue.name ] = nameValue.value;
                  }
                });
              }
            }
          }
        this.patchFinished = true;
        this.currentPatchField = null;
        this.currentPatchFieldRow = null;
      },
      error: err => {
        if (err._body === Auth.AUTHENTICATION_ERROR) {
          this.auth.doLogout();
        }
      }
    });
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
      if (this.oncHistory[ index ].additionalValuesJson != null) {
        const camelCaseColumnName = Utils.convertUnderScoresToCamelCase(colName);
        this.oncHistory[ index ].additionalValuesJson[ camelCaseColumnName ] = v;
        this.oncHistory[ index ].additionalValuesJson[ colName ] = v;
      } else {
        const addArray = {};
        addArray[ colName ] = v;
        this.oncHistory[ index ].additionalValuesJson = addArray;
      }
      this.valueChanged(this.oncHistory[ index ].additionalValuesJson, 'additionalValuesJson', index);
      if (index === this.oncHistory.length - 1) {
        this.addNewOncHistory(this.oncHistory[ index ].participantId);
      }
    }
  }

  // display additional value
  getAdditionalValue(index: number, colName: string): string {
    const camelCaseColumnName = Utils.convertUnderScoresToCamelCase(colName);
    if (this.oncHistory[index].additionalValuesJson != null && this.oncHistory[index].additionalValuesJson[camelCaseColumnName] != null) {
      return this.oncHistory[index].additionalValuesJson[camelCaseColumnName];
    }
    return null;
  }

  addNewOncHistory(participantId: string): void {
    const tissues: Array<Tissue> = [];
    tissues.push(new Tissue(null, null, null, null, null, null,
      null, null, null, null, null, null, null, null,
      null, null, null, null, null, null, null,
      null, null, null, null, null, null, null, null, null, null, false));
    this.oncHistory.push(new OncHistoryDetail(participantId, null, null, null, null,
      null, null, null, null, null, null, null, null,
      null, null, null, null, null, null, null, null, null,
      null, null, null, tissues,
      null, null, null, null, false));
  }

  deleteOncHistory(index: number): void {
    const realm: string = sessionStorage.getItem(ComponentService.MENU_SELECTED_REALM);
    const patch1 = new PatchUtil(
      this.oncHistory[index].oncHistoryDetailId, this.role.userMail(),
      {
        name: 'deleted',
        value: true
      }, null, 'participantId', this.participant.participant.participantId,
      Statics.ONCDETAIL_ALIAS, null, realm, this.participant.data.profile['guid']
    );
    const patch = patch1.getPatch();
    this.patchFinished = false;
    this.dsmService.patchParticipantRecord(JSON.stringify(patch)).subscribe({ // need to subscribe, otherwise it will not send!
      next: data => {
        this.oncHistory[ index ].deleted = true;
        this.oncHistory.splice( index, 1 );
        this.patchFinished = true;
        this.currentPatchField = null;
        this.errorMessage = null;
      },
      error: err => {
        if (err._body === Auth.AUTHENTICATION_ERROR) {
          this.auth.doLogout();
        } else if (err.error === 'This object is used in a clinical order') {
          this.errorMessage = 'Couldn\'t delete OncHistory, a clinical order is already placed for one of the tissues';
        }
      }
    });

    this.triggerReload.next(true);

    if (index === this.oncHistory.length - 1) {
      this.addNewOncHistory(this.oncHistory[ index ].participantId);
    }
  }

  openTissuePage(oncHis: OncHistoryDetail): void {
    if (oncHis != null) {
      this.oncHistoryDetail = oncHis;
      this.compService.editable = (
        (oncHis.request === 'sent') || (oncHis.request === 'received')
        || (oncHis.request === 'returned') || (oncHis.request === 'unableObtainTissue')
      );
      this.showTissue = true;
      this.openTissue.emit(oncHis);
    }
  }

  selected(): void {
    this.selectionChanged.next(true);
  }

  openNoteModal(index: number): void {
    this.indexForNote = index;
    this.note = this.oncHistory[ this.indexForNote ].notes;
  }

  saveNote(): void {
    this.oncHistory[ this.indexForNote ].notes = this.note;
    this.valueChanged(this.note, 'notes', this.indexForNote);
  }

  setFacility(contact: Lookup | string, index: number): void {
    const realm: string = sessionStorage.getItem(ComponentService.MENU_SELECTED_REALM);
    if (contact != null) {
      if (contact instanceof Lookup) {
        this.oncHistory[ index ].facility = contact.field1.value;
        if (contact.field3 != null) {
          this.oncHistory[ index ].phone = contact.field3.value;
        }
        if (contact.field4 != null) {
          this.oncHistory[ index ].fax = contact.field4.value;
        }
        if (contact.field5 != null) {
          this.oncHistory[ index ].destructionPolicy = contact.field5.value;
        }
        const nameValues = this.buildFacilityNameValues(contact);
        const patch1 = new PatchUtil(
          this.oncHistory[ index ].oncHistoryDetailId, this.role.userMail(),
          null, nameValues, 'participantId', this.participant.participant.participantId,
          Statics.ONCDETAIL_ALIAS, null, realm, this.participant.data.profile['guid']
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
          }, null, 'participantId', this.participant.participant.participantId,
          Statics.ONCDETAIL_ALIAS, null, realm, this.participant.data.profile['guid']
        );
        const patch = patch1.getPatch();
        this.patchFinished = false;
        this.currentPatchField = 'facility';
        this.currentPatchFieldRow = index;
        this.patch(patch, index);
      }
    }
  }

  private buildFacilityNameValues(contact: any): Array<NameValue> {
    const nameValues = [];
      nameValues.push({ name: 'oD.facility', value: contact.field1.value || ''});
      nameValues.push({ name: 'oD.phone', value: contact.field3.value || ''});
      nameValues.push({ name: 'oD.fax', value: contact.field4.value || ''});
      nameValues.push({ name: 'oD.destructionPolicy', value: contact.field5.value || ''});

    return nameValues;
  }

  public setTypePx(object: Lookup | string, index: number): void {
    if (object != null) {
      if (object instanceof Lookup) {
        // slow save to make sure value is saved to right value
        this.oncHistory[ index ].typePx = object.field1.value;
        const realm: string = sessionStorage.getItem(ComponentService.MENU_SELECTED_REALM);
        const patch1 = new PatchUtil(
          this.oncHistory[ index ].oncHistoryDetailId, this.role.userMail(),
          {
            name: 'typePx',
            value: object.field1.value
          }, null, 'participantId', this.participant.participant.participantId,
          Statics.ONCDETAIL_ALIAS, null, realm, this.participant.data.profile['guid']
        );
        const patch = patch1.getPatch();
        this.multipleValueChanged(patch, index, 'typePx');
      } else {
        this.oncHistory[ index ].typePx = object;
        this.valueChanged(this.oncHistory[ index ].typePx, 'typePx', index);
      }
    }
  }

  public setHistology(object: Lookup | string, index: number): void {
    if (object != null) {
      if (object instanceof Lookup) {
        // slow save to make sure value is saved to right value
        this.oncHistory[ index ].histology = object.field1.value;
        const realm: string = sessionStorage.getItem(ComponentService.MENU_SELECTED_REALM);
        const patch1 = new PatchUtil(
          this.oncHistory[ index ].oncHistoryDetailId, this.role.userMail(),
          {
            name: 'histology',
            value: object.field1.value
          }, null, 'participantId', this.participant.participant.participantId,
          Statics.ONCDETAIL_ALIAS, null, realm, this.participant.data.profile['guid']
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
