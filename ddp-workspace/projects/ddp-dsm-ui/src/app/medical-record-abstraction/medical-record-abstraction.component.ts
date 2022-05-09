import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractionGroup } from '../abstraction-group/abstraction-group.model';
import { Participant } from '../participant-list/participant-list.model';
import { AbstractionField } from './model/medical-record-abstraction-field.model';

@Component({
  selector: 'app-medical-record-abstraction',
  templateUrl: './medical-record-abstraction.component.html',
  styleUrls: [ './medical-record-abstraction.component.css' ]
})
export class MedicalRecordAbstractionComponent {
  @Input() participant: Participant;
  @Input() abstractionFormControls: Array<AbstractionGroup> = [];
  @Input() editForm = false;
  @Input() abstractionActivity: string;
  @Input() status: string;
  @Input() fileList: string[];
  @Input() drugList: string[];
  @Input() cancerList: string[];
  @Output() emitFileName = new EventEmitter();

  nameCurrentFile: string;

  newGroup: string;
  notUniqueError: boolean;

  addGroup(): void {
    if (!this.notUniqueError) {
      const fields: AbstractionField[] = [];
      const newAbstractionGroup = new AbstractionGroup(null, this.newGroup, this.abstractionFormControls.length, fields);
      newAbstractionGroup.changed = true;
      newAbstractionGroup.newAdded = true;
      this.abstractionFormControls.push(newAbstractionGroup);
      this.newGroup = null;
    }
  }

  addFileToList(fileName: string): void {
    if (fileName != null && fileName !== '') {
      let found = false;
      for (const file of this.fileList) {
        if (file === fileName) {
          found = true;
          break;
        }
      }
      if (!found) {
        this.fileList.push(fileName);
      }
      this.nameCurrentFile = fileName;
      this.emitFileName.emit(fileName);
    }
  }

  checkName(displayName: string): void {
    this.notUniqueError = false;
    for (const field of this.abstractionFormControls) {
      if (field.displayName.toLowerCase() === displayName.toLowerCase()) {
        this.notUniqueError = true;
      }
    }
    return null;
  }

  findGroup(group: Array<AbstractionGroup>, medicalRecordAbstractionGroupId: number): AbstractionGroup {
    if (group != null) {
      return group.find(gr => gr.abstractionGroupId === medicalRecordAbstractionGroupId);
    }
  }
}
