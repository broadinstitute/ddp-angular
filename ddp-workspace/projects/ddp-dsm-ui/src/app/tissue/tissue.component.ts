import { Component, Input, ViewChild } from '@angular/core';
import { FieldSettings } from '../field-settings/field-settings.model';
import { OncHistoryDetail } from '../onc-history-detail/onc-history-detail.model';
import { Participant } from '../participant-list/participant-list.model';
import { Tissue } from './tissue.model';
import { RoleService } from '../services/role.service';
import { DSMService } from '../services/dsm.service';
import { ComponentService } from '../services/component.service';
import { Lookup } from '../lookup/lookup.model';
import { Statics } from '../utils/statics';
import { Auth } from '../services/auth.service';
import { Router } from '@angular/router';
import { NameValue } from '../utils/name-value.model';
import { PatchUtil } from '../utils/patch.model';
import { ModalComponent } from '../modal/modal.component';
import {TissueSmId} from './sm-id.model';

@Component({
  selector: 'app-tissue',
  templateUrl: './tissue.component.html',
  styleUrls: [ './tissue.component.css' ],
})
export class TissueComponent {
  @ViewChild('collaboratorSampleId') collaboratorSampleIdInputField;
  @ViewChild( ModalComponent )
  public SMIDModal: ModalComponent;

  @Input() participant: Participant;
  @Input() oncHistoryDetail: OncHistoryDetail;
  @Input() additionalColumns: Array<FieldSettings>;
  @Input() tissue: Tissue;
  @Input() tissueId: string;
  @Input() editable: boolean;

  collaboratorS: string;
  currentPatchField: string;
  patchFinished = true;
  dup = false;
  currentSMIDField: string;
  uss = 'USS';
  he = 'HE';
  scrolls = 'scrolls';
  selectedSmIds = 0;
  smIdDuplicate = {};

  constructor(private role: RoleService, private dsmService: DSMService, private compService: ComponentService, private router: Router) {
    this.smIdDuplicate[ this.uss ] = new Set();
    this.smIdDuplicate[ this.he ] = new Set();
    this.smIdDuplicate[ this.scrolls ] = new Set();
  }

  public getCompService(): ComponentService {
    return this.compService;
  }

  public setTissueSite(object: Lookup | string): void {
    if (object != null) {
      this.tissue.tissueSite = object instanceof Lookup ? object.field1.value : object;
      this.valueChanged(this.tissue.tissueSite, 'tissueSite');
    }
  }

  onAdditionalColChange(evt: any, colName: string): void {
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
      if (this.tissue.additionalValuesJson != null) {
        this.tissue.additionalValuesJson[colName] = v;
      } else {
        const addArray = {};
        addArray[colName] = v;
        this.tissue.additionalValuesJson = addArray;
      }
      this.valueChanged(this.tissue.additionalValuesJson, 'additionalValuesJson');
    }
  }

  // display additional value
  getAdditionalValue(colName: string): string {
    if (this.tissue.additionalValuesJson != null) {
      if (this.tissue.additionalValuesJson[colName] != null) {
        return this.tissue.additionalValuesJson[colName];
      }
    }
    return null;
  }

  valueChanged(value: any, parameterName: string, pName?: string, pId?, alias?, smId?, smIdArray?, index?, value2?, parameter2?): void {
    let v;
    let parentName = 'oncHistoryDetailId';
    if (pName) {
      parentName = pName;
    }
    let parentId = this.tissue.oncHistoryDetailId;
    if (pId) {
      parentId = pId;
    }
    let tAlias = Statics.TISSUE_ALIAS;
    if (alias) {
      tAlias = alias;
    }
    let id = this.tissue.tissueId;
    if (smId) {
      id = smId;
    }
    if (tAlias === 'sm' && !smId) {
      id = null;
    }
    if (parameterName === 'additionalValuesJson') {
      v = JSON.stringify(value);
    } else if (typeof value === 'string') {
      v = value;
    } else {
      if (value.srcElement != null && typeof value.srcElement.value === 'string') {
        v = value.srcElement.value;
      } else if (value.value != null) {
        v = value.value;
      } else if (value.checked != null) {
        v = value.checked;
      }
    }
    if (v !== null) {
      let nameValues = null;
      if (tAlias !== 'sm') {
        if (parameterName !== 'additionalValuesJson') {
          for (const oncTissue of this.oncHistoryDetail.tissues) {
            if (oncTissue.tissueId === this.tissue.tissueId) {
              oncTissue[ parameterName ] = v;
            }
          }
        }
        this.currentPatchField = parameterName;
      }
      if (parameter2 && value2) {
        nameValues = [];
        const nameValueForType = {
          name: parameterName,
          value: v
        };
        const nameValueForValue = {
          name: parameter2,
          value: value2
        };
        nameValues.push( nameValueForType );
        nameValues.push( nameValueForValue );
      }
      const patch1 = new PatchUtil(id, this.role.userMail(),
        {
          name: parameterName,
          value: v,
        }, nameValues, parentName, parentId, tAlias, null,
        localStorage.getItem(ComponentService.MENU_SELECTED_REALM), this.participant.data.profile['guid']
      );
      const patch = patch1.getPatch();
      this.patchFinished = false;
      this.dsmService.patchParticipantRecord(JSON.stringify(patch)).subscribe({ // need to subscribe, otherwise it will not send!
        next: data => {
          if ( data && this.tissue.tissueId == null ) {
            this.tissue.tissueId = data['tissueId'];
            this.patchFinished = true;
            this.currentPatchField = null;
            this.dup = false;
            if ( data instanceof Array ) {
              data.forEach((val) => {
                const nameValue = NameValue.parse(val);
                this.oncHistoryDetail[nameValue.name] = nameValue.value;
              });
            }
          // } else if (result.code === 500 && result.body != null) {
          //   this.dup = true;
          //   if (tAlias === 'sm') {
          //     if (smIdArray && index && smId) {
          //       smIdArray[ index ].smIdPk = smId;//for new sm ids
          //     }
          //     this.smIdDuplicate[ this.currentSMIDField ].add(this.createDuplicateIndex( index ) );
          //   }
          // } else if (result.code === 200) {
          //   if (result.body != null && result.body !== '') {
          //     const jsonData: any | any[] = JSON.parse( result.body );
          //     if (tAlias === 'sm') {
          //       if (jsonData.smId) {
          //         smId = jsonData.smId;
          //         if (smIdArray && index) {
          //           smIdArray[ index ].smIdPk = smId;
          //         }
          //
          //       }
          //       this.smIdDuplicate[ this.currentSMIDField ].delete( this.createDuplicateIndex (index));
          //       this.patchFinished = true;
          //       this.currentPatchField = null;
          //       this.dup = false;
          //       return smId;
          //     }
          //     if (jsonData instanceof Array) {
          //       jsonData.forEach( ( val ) => {
          //         const nameValue = NameValue.parse( val );
          //         if (nameValue.name && nameValue.name.indexOf( '.' ) !== -1) {
          //           nameValue.name = nameValue.name.substring( nameValue.name.indexOf( '.' ) + 1 );
          //         }
          //         this.oncHistoryDetail[ nameValue.name ] = nameValue.value;
          //       } );
          //     }
          //   }
          //   this.patchFinished = true;
          //   this.currentPatchField = null;
          //   this.dup = false;
          }
          if (data['smIdPk']) {
            smIdArray[index].smIdPk = data['smIdPk'];
          }
        },
        error: err => {
          this.dup = true;
          if (err._body === Auth.AUTHENTICATION_ERROR) {
            this.router.navigate([ Statics.HOME_URL ]);
          }
        },
      });
    }
  }

  deleteTissue(): void {
    this.tissue.deleted = true;
  }

  public getStyleDisplay(): string {
    return this.collaboratorS != null ? Statics.DISPLAY_BLOCK : Statics.DISPLAY_NONE;
  }

  public checkCollaboratorId(): void {
    let jsonData: any[];
    if (this.collaboratorS == null && (this.tissue.collaboratorSampleId == null || this.tissue.collaboratorSampleId === '')) {
      this.dsmService.lookupCollaboratorId(
        'tCollab', this.participant.participant.ddpParticipantId,
          this.participant.data.profile['hruid'], localStorage.getItem(ComponentService.MENU_SELECTED_REALM)
        )
        .subscribe({// need to subscribe, otherwise it will not send!
          next: data => {
            jsonData = data;
            jsonData.forEach((val) => {
              const con = Lookup.parse(val);
              this.collaboratorS = con.field1.value + '_';
            });
          },
          error: err => {
            if (err._body === Auth.AUTHENTICATION_ERROR) {
              this.router.navigate([Statics.HOME_URL]);
            }
          },
        });
    }
  }

  public setLookup(): void {
    this.tissue.collaboratorSampleId = this.collaboratorS;
    this.collaboratorS = null;
    this.collaboratorSampleIdInputField.nativeElement.focus();
  }

  isPatchedCurrently(field: string): boolean {
    return this.currentPatchField === field;
  }

  currentField(field: string): void {
    if (field != null || (field == null && this.patchFinished)) {
      this.currentPatchField = field;
    }
  }

  changeSmId( event: any, parameterName, id, type, smIdArray, index, filedName? ): void {
    let value: any;
    if (typeof event === 'string') {
      value = event;
    }
    else if (event.srcElement != null && typeof event.srcElement.value === 'string') {
      value = event.srcElement.value;
    }
    else if (typeof event === 'boolean') {
      value = event;
    }
    else if (event.value != null) {
      value = event.value;
    }
    if (filedName) {
      this.currentPatchField = filedName;
    }
    if (!id) {
      this.valueChanged(
        type, 'smIdType', 'tissueId',
        this.tissue.tissueId, Statics.SM_ID_ALIAS, id, smIdArray, index, value, parameterName
      );
    }
    else {
      this.valueChanged( value, parameterName, 'tissueId', this.tissue.tissueId, Statics.SM_ID_ALIAS, id, smIdArray, index );
    }
  }

  openUSSModal(): void {
    this.currentSMIDField = this.uss;
    this.SMIDModal.show();
  }

  openHEModal(): void {
    this.currentSMIDField = this.he;
    this.SMIDModal.show();
  }

  openScrollsModal(): void {
    this.currentSMIDField = this.scrolls;
    this.SMIDModal.show();
  }

  getValue( s: TissueSmId ): string {
    if (!s || !s.smIdValue) {
      return '';
    }
    return s.smIdValue;
  }

  exitModal(): void {
    this.SMIDModal.hide();
  }

  goNext( name: string, i: number ): void {
    const nextId = name + ( i + 1 );
    const nextElement = document.getElementById( nextId );
    if (nextElement) {
      nextElement.focus();
    }
  }

  smIdCountMatch( array: any[], num: number ): boolean {
    if (!array) {
      return num === 0;
    }
    return array.length === num;
  }

  addSMId( name ): void {
    if (name === this.uss) {
      if (!this.tissue.ussSMId) {
        this.tissue.ussSMId = [];
      }
      this.tissue.ussSMId.push( new TissueSmId( null, this.uss, null, this.tissue.tissueId, false ) );
    }
    else if (name === this.scrolls) {
      if (!this.tissue.scrollSMId) {
        this.tissue.scrollSMId = [];
      }
      this.tissue.scrollSMId.push( new TissueSmId( null, this.scrolls, null, this.tissue.tissueId, false ) );
    }
    else if (name === this.he) {
      if (!this.tissue.HESMId) {
        this.tissue.HESMId = [];
      }
      this.tissue.HESMId.push( new TissueSmId( null, this.he, null, this.tissue.tissueId, false ) );
    }
  }

  deleteSMID( array: TissueSmId[], i: number ): void {
    array[ i ].deleted = true;
    if (array[ i ].smIdPk) {
      this.changeSmId('1', 'deleted', array[ i ].smIdPk, array[ i ].smIdType, array, i );
    }
    if (this.smIdDuplicate[ this.currentSMIDField ].has( this.createDuplicateIndex( i ) )) {
      this.smIdDuplicate[ this.currentSMIDField ].delete( this.createDuplicateIndex( i ) );
    }
    array.splice( i, 1 );
  }

  checkboxChecked( event: any, smidArray: TissueSmId[], index: number ): void {
    if (event.checked && event.checked === true) {
      smidArray[ index ].isSelected = true;
      this.selectedSmIds += 1;
    }
    else if (event.checked !== undefined && event.checked !== null && event.checked === false) {
      smidArray[ index ].isSelected = false;
      this.selectedSmIds -= 1;
    }
  }

  exitModalAndDeleteRest( name ): void {
    if (name === this.uss) {
      for (let i = 0; i < this.tissue.ussSMId.length; i += 1) {
        if (!this.tissue.ussSMId[ i ].isSelected) {
          this.deleteSMID( this.tissue.ussSMId, i );
        }
        else {
          this.tissue.ussSMId[ i ].isSelected = false;
        }
      }
    }
    else if (name === this.scrolls) {
      for (let i = 0; i < this.tissue.scrollSMId.length; i += 1) {
        if (!this.tissue.scrollSMId[ i ].isSelected) {
          this.deleteSMID( this.tissue.scrollSMId, i );
        }
        else {
          this.tissue.scrollSMId[ i ].isSelected = false;
        }
      }
    }
    else if (name === this.he) {
      for (let i = 0; i < this.tissue.HESMId.length; i += 1) {
        if (!this.tissue.HESMId[ i ].isSelected) {
          this.deleteSMID( this.tissue.HESMId, i );
        }
        else {
          this.tissue.HESMId[ i ].isSelected = false;
        }
      }
    }
    this.exitModal();
  }

  checkBoxNeeded( name: string, index ): boolean {
    if (name === this.uss) {
      if (!this.tissue.ussSMId) {
        this.tissue.ussSMId = new Array<TissueSmId>();
      }
      return ( this.tissue.ussCount < this.tissue.ussSMId.length &&
        !this.smIdDuplicate[ this.uss ].has( this.createDuplicateIndex(index, name) )
      );
    }
    else if (name === this.scrolls) {
      if (!this.tissue.scrollSMId) {
        this.tissue.scrollSMId = new Array<TissueSmId>();
      }
      return ( this.tissue.scrollsCount < this.tissue.scrollSMId.length &&
        !this.smIdDuplicate[ this.scrolls ].has( this.createDuplicateIndex(index, name)  )
      );
    }
    else if (name === this.he) {
      if (!this.tissue.HESMId) {
        this.tissue.HESMId = new Array<TissueSmId>();
      }
      return ( this.tissue.hECount < this.tissue.HESMId.length &&
        !this.smIdDuplicate[ this.he ].has( this.createDuplicateIndex(index, name)  )
      );
    }
  }

  isDuplicate( currentSMIDField: string,  index: number ): boolean {
    return ( this.smIdDuplicate[ currentSMIDField ].has( this.createDuplicateIndex( index, currentSMIDField ) ) );
  }

  createDuplicateIndex( i: number, name?: string ): string {
    if(!name) {
      name = this.currentSMIDField;
    }
    return name + i;
  }

  canChangeThis(i: number, name: string): boolean {
    const index = this.createDuplicateIndex(i, name);
    return this.editable && (this.smIdDuplicate[name].size === 0 || this.smIdDuplicate[name].has(index));
  }
}
