import { Component, Input, OnInit } from '@angular/core';
import { FormSectionDef } from '../model/formSectionDef';

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss']
})
export class SectionComponent implements OnInit {
  @Input() section: FormSectionDef | undefined;
  public validationRequested = false;
  public readonly = true;
  public activityGuid = '';
  public studyGuid = '';
  public displayNumber = false;

  constructor() { }

  ngOnInit(): void {
  }

}
