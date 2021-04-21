import { Component, Input, OnInit } from '@angular/core';
import { ContentBlockDef } from '../model/contentBlockDef';

@Component({
  selector: 'app-content-block',
  templateUrl: './content-block.component.html',
  styleUrls: ['./content-block.component.scss']
})
export class ContentBlockComponent implements OnInit {
  @Input() block: ContentBlockDef;

  constructor() { }

  ngOnInit(): void {
  }

  get title(): string {
    return 'The title';
  }

  get content(): string {
    return 'content!!!';
  }
}
