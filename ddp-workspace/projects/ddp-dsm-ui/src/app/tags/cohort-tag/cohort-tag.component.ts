import { Component, Input, OnInit } from '@angular/core';
import {MatChipInputEvent} from '@angular/material/chips';
import {COMMA, ENTER } from '@angular/cdk/keycodes';

import { ComponentService } from '../../services/component.service';
import { DSMService } from '../../services/dsm.service';
import { CohortTag } from './cohort-tag.model';

@Component({
  selector: 'app-cohort-tag',
  templateUrl: './cohort-tag.component.html',
  styleUrls: ['./cohort-tag.component.scss']
})
export class CohortTagComponent implements OnInit {
  @Input() ddpParticipantId: string;
  @Input() dsm: Object;

  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  tags: CohortTag[];

  public static readonly COHORT_TAG = 'cohortTag';
  public duplicateError: boolean = false;

  constructor(private compService: ComponentService, private dsmService: DSMService) { }

  ngOnInit(): void {
    if (this.hasNotCohortTag()) {
      this.dsm[CohortTagComponent.COHORT_TAG] = [];
    }
    this.tags = this.getTags();
  }

  private hasNotCohortTag(): boolean {
    return !this.dsm[CohortTagComponent.COHORT_TAG];
  }

  private getTags(): CohortTag[] {
    return this.dsm[CohortTagComponent.COHORT_TAG];
  }

  add(event: MatChipInputEvent): void {
    this.duplicateError = false;
    const value = (event.value || '').trim();

    if (value) {
      const newTag = new CohortTag(value, this.ddpParticipantId);
      if (this.getTags().find(tag => tag.cohortTagName === value)){
        this.duplicateError = true;
        return;
      }
      this.dsmService.createCohortTag(JSON.stringify(newTag), this.compService.getRealm())
        .subscribe({
          next: cohortTagId => {
            newTag.cohortTagId = parseInt(cohortTagId);
            this.getTags().push(newTag);
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            // Clear the input value
            event.chipInput!.clear();
          },
          error: (error) => {
            if(error.status == 500){
              this.duplicateError = true;
            }
          }
        });
    }
  }

  remove(tagToRemove: CohortTag): void {
    const foundTagIndex = this.getTags().findIndex(tag => this.isTheSameTag(tagToRemove, tag));

    if (foundTagIndex >= 0) {
      if (tagToRemove.cohortTagId) {
        this.dsmService.deleteCohortTag(tagToRemove.cohortTagId, this.compService.getRealm()).subscribe();
      }
      this.getTags().splice(foundTagIndex, 1);
    }
  }


  private isTheSameTag(tagToRemove: CohortTag, tag: CohortTag): boolean {
    if (tagToRemove.cohortTagId && tag.cohortTagId) {
      return tagToRemove.cohortTagId === tag.cohortTagId;
    }
    return tagToRemove.cohortTagName === tag.cohortTagName;
  }
}
