import { Component, OnInit } from '@angular/core';
import { ComponentService } from '../services/component.service';
import { PatchUtil } from '../utils/patch.model';
import { Result } from '../utils/result.model';
import { Statics } from '../utils/statics';
import { DrugList } from './drug-list.model';
import { Auth } from '../services/auth.service';
import { DSMService } from '../services/dsm.service';
import { RoleService } from '../services/role.service';

@Component({
  selector: 'app-drug-list',
  templateUrl: './drug-list.component.html',
  styleUrls: [ './drug-list.component.css' ]
})
export class DrugListComponent implements OnInit {
  errorMessage: string;
  additionalMessage: string;

  loading = false;
  drugList: DrugList[];

  notUniqueError = false;
  duplicatedNamesError = false;

  filterDisplayName = '';
  filterGenericName = '';
  filterBrandName = '';
  filterChemocat = '';
  filterChemoType = '';
  filterTreatmentType = '';
  filterChemotherapy = '';

  displayName = '';
  genericName = '';
  brandName = '';
  chemocat = '';
  chemoType = '';
  studyDrug = false;
  treatmentType = '';
  chemotherapy = '';
  active = false;

  currentPatchField: string;
  currentPatchFieldRow: number;
  patchFinished = true;

  constructor(private auth: Auth, private dsmService: DSMService, private role: RoleService) {
  }

  ngOnInit(): void {
    this.getListOfDrugObjects();
  }

  getListOfDrugObjects(): void {
    this.loading = true;
    let jsonData: any[];
    this.dsmService.getDrugs().subscribe(
      data => {
        this.drugList = [];
        jsonData = data;
        // console.info(`received: ${JSON.stringify(data, null, 2)}`);
        jsonData.forEach((val) => {
          const event = DrugList.parse(val);
          this.drugList.push(event);
        });
        this.loading = false;
      },
      err => {
        if (err._body === Auth.AUTHENTICATION_ERROR) {
          this.auth.logout();
        }
        this.loading = false;
        this.errorMessage = 'Error - Loading Drug List\nPlease contact your DSM developer';
      }
    );
  }

  hasRole(): RoleService {
    return this.role;
  }


  valueChanged(value: any, parameterName: string, index: number): void {
    let v;

    if (parameterName === 'displayName') {
      this.checkDisplayName(index);
      if (this.drugList[ index ].notUniqueError) {
        return;
      }
    } else if (parameterName === 'genericName' || parameterName === 'brandName') {
      this.checkDuplicatedNames(index);
      if (this.drugList[ index ].duplicatedNamesError) {
        return;
      }
    }

    if (typeof value === 'string') {
      this.drugList[ index ][ parameterName ] = value;
      v = value;
    } else if (value != null) {
      if (value.srcElement != null && typeof value.srcElement.value === 'string') {
        v = value.srcElement.value;
      } else if (value.value != null) {
        v = value.value;
      } else if (value.checked != null) {
        v = value.checked;
      } else if (typeof value === 'object') {
        v = JSON.stringify(value);
      }
    }
    if (v != null) {
      const patch1 = new PatchUtil(this.drugList[ index ].drugId, this.role.userMail(),
        {
          name: parameterName,
          value: v
        }, null, null, null, Statics.DRUG_ALIAS,  null, localStorage.getItem(ComponentService.MENU_SELECTED_REALM), null);
      const patch = patch1.getPatch();
      this.patchFinished = false;
      this.currentPatchField = parameterName;
      this.currentPatchFieldRow = index;
      this.patch(patch);
    }
  }

  patch(patch: any): void {
    this.dsmService.patchParticipantRecord(JSON.stringify(patch)).subscribe(// need to subscribe, otherwise it will not send!
      data => {
        const result = Result.parse(data);
        if (result.code !== 200) {
          this.additionalMessage = 'Error - Saving Drug\nPlease contact your DSM developer';
        }
        this.patchFinished = true;
        this.currentPatchField = null;
        this.currentPatchFieldRow = null;
      },
      err => {
        if (err._body === Auth.AUTHENTICATION_ERROR) {
          this.auth.logout();
        }
      }
    );
  }

  addDrug(): void {
    const drug: DrugList = new DrugList(null, this.genericName, this.brandName, this.displayName,
      this.chemocat, this.chemoType, this.studyDrug, this.treatmentType, this.chemotherapy, this.active);
    drug.addedNew = true;
    this.saveDrugList(drug);
    this.genericName = '';
    this.brandName = '';
    this.displayName = '';
    this.chemocat = '';
    this.chemoType = '';
    this.studyDrug = false;
    this.treatmentType = '';
    this.chemotherapy = '';
    this.active = false;
  }

  goodNewDrug(): boolean {
    if (this.genericName == null || this.genericName === '' || this.displayName == null || this.displayName === '' ||
      this.chemocat == null || this.chemocat === '' || this.chemoType == null || this.chemoType === '' ||
      this.treatmentType == null || this.treatmentType === '' || this.chemotherapy == null || this.chemotherapy === '' ||
      this.notUniqueError || this.duplicatedNamesError
    ) {
      return false;
    }
    return true;
  }

  saveDrugList(drug: DrugList): void {
    this.loading = true;
    this.dsmService.saveDrug(JSON.stringify(drug)).subscribe(
      _ => {
        this.getListOfDrugObjects();
        this.loading = false;
        this.additionalMessage = 'Data saved';
      },
      err => {
        if (err._body === Auth.AUTHENTICATION_ERROR) {
          this.auth.logout();
        }
        this.loading = false;
        this.additionalMessage = 'Error - Saving Drug\nPlease contact your DSM developer';
      }
    );
    window.scrollTo(0, 0);
  }

  checkDisplayName(index: number): void {
    if (index == null) {
      this.notUniqueError = false;
      const drug = this.drugList.find(drg => drg.displayName === this.displayName);
      if (drug != null) {
        this.notUniqueError = true;
      }
    } else {
      this.drugList[ index ].notUniqueError = false;
      for (let i = 0; i < this.drugList.length; i++) {
        if (i !== index) {
          if (this.drugList[ i ].displayName === this.drugList[ index ].displayName) {
            this.drugList[ index ].notUniqueError = true;
          }
        }
      }
    }
    return null;
  }

  // Validate against rows with generic & brand name values that are identical to another row
  checkDuplicatedNames(index: number): void {
    if (index == null) {
      this.duplicatedNamesError = false;
      const drug = this.drugList.find(drg => drg.genericName === this.genericName && drg.brandName === this.brandName);
      if (drug != null) {
        this.duplicatedNamesError = true;
      }
    } else {
      this.drugList[ index ].duplicatedNamesError = false;
      for (let i = 0; i < this.drugList.length; i++) {
        if (i !== index) {
          if (this.drugList[i].genericName === this.drugList[index].genericName
            && this.drugList[i].brandName === this.drugList[index].brandName
          ) {
            this.drugList[index].duplicatedNamesError = true;
          }
        }
      }
    }
    return null;
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
}
