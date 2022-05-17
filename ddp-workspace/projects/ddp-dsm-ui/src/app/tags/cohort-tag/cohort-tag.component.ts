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

  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  tags: CohortTag[] = [
    new CohortTag('Lemon', 'GUID1', 1),
    new CohortTag('Apple', 'GUID2', 2),
    new CohortTag('Banana', 'GUID3', 3)
  ];

  
  constructor(private compService: ComponentService, private dsmService: DSMService) { }
  
  ngOnInit(): void {
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      const newTag = new CohortTag(value, this.ddpParticipantId);
      this.tags.push(newTag);
      this.dsmService.createCohortTag(JSON.stringify(newTag), this.compService.getRealm()).subscribe(data => {

      }, err => {

      });
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  remove(tagToRemove: CohortTag): void {
    const foundTagIndex = this.tags.findIndex(tag => this.isTheSameTag(tagToRemove, tag));

    if (foundTagIndex >= 0) {
      this.tags.splice(foundTagIndex, 1);
    }
  }


  private isTheSameTag(tagToRemove: CohortTag, tag: CohortTag): unknown {
    return tagToRemove.tagName === tag.tagName;
  }
}
