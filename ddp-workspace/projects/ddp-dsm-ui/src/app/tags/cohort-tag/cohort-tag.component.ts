import { Component, Input, OnInit } from '@angular/core';
import { CohortTag } from './cohort-tag.model';
import {MatChipInputEvent} from '@angular/material/chips';
import {COMMA, ENTER} from '@angular/cdk/keycodes';

import { ComponentService } from '../../services/component.service';
import { DSMService } from '../../services/dsm.service';

@Component({
  selector: 'app-cohort-tag',
  templateUrl: './cohort-tag.component.html',
  styleUrls: ['./cohort-tag.component.scss']
})
export class CohortTagComponent implements OnInit {

  @Input() ddpParticipantId: string;
  @Input() tags: CohortTag[];

  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  
  constructor(private compService: ComponentService, private dsmService: DSMService) { }
  
  ngOnInit(): void {
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      const newTag = new CohortTag(value, this.ddpParticipantId);
      this.dsmService.createCohortTag(JSON.stringify(newTag), this.compService.getRealm()).subscribe(cohortTagId => {
        newTag.cohortTagId = parseInt(cohortTagId);
        this.tags.push(newTag);
        // Clear the input value
        event.chipInput!.clear();
      }, err => {
        
      });
    }

  }

  remove(tagToRemove: CohortTag): void {
    const foundTagIndex = this.tags.findIndex(tag => this.isTheSameTag(tagToRemove, tag));

    if (foundTagIndex >= 0) {
      this.tags.splice(foundTagIndex, 1);
    }
  }


  private isTheSameTag(tagToRemove: CohortTag, tag: CohortTag): unknown {
    return tagToRemove.cohortTagName === tag.cohortTagName;
  }
}
