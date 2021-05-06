import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ContentBlockDef } from '../../model/core/contentBlockDef';
import { ActivityContentBlock } from 'ddp-sdk';
import { filter, map } from 'rxjs/operators';
import { SimpleTemplate } from '../../model/core-extended/simpleTemplate';
import { ConfigurationService } from '../../configuration.service';

@Component({
  selector: 'app-static-content-block',
  templateUrl: './static-content-block.component.html',
  styleUrls: ['./static-content-block.component.scss']
})
export class StaticContentBlockComponent implements OnInit {
  @Input()
  definitionBlock$: Observable<ContentBlockDef>;
  angularClientBlock$: Observable<ActivityContentBlock>;

  constructor(private config: ConfigurationService) {}

  ngOnInit(): void {
    this.angularClientBlock$ = this.definitionBlock$.pipe(
        filter(block => !!block),
        map(defBlock => this.buildFromDef(defBlock)));
  }

  private buildFromDef(defBlock: ContentBlockDef): ActivityContentBlock {
    const angularBlock = new ActivityContentBlock();
    angularBlock.title = defBlock.titleTemplate ?
        new SimpleTemplate(defBlock.titleTemplate).getTranslationText(this.config.defaultLanguageCode) : null;
    // TODO handle templates properly!
    angularBlock.content = defBlock.bodyTemplate ?
        new SimpleTemplate(defBlock.bodyTemplate).getTranslationText(this.config.defaultLanguageCode) : null;
    return angularBlock;
  }
}
