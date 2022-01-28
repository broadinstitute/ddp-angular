import { Component, OnInit } from '@angular/core';

import { ActivityContentBlock } from 'ddp-sdk';
import { ContentBlockDef } from '../../model/core/contentBlockDef';
import { SimpleTemplate } from '../../model/core-extended/simpleTemplate';
import { ConfigurationService } from '../../configuration.service';
import { BaseBlockComponent } from '../base-block/base-block.component';

@Component({
    selector: 'app-static-content-block',
    templateUrl: './static-content-block.component.html',
    styleUrls: ['./static-content-block.component.scss']
})
export class StaticContentBlockComponent
    extends BaseBlockComponent<ContentBlockDef, ActivityContentBlock, null>
    implements OnInit {

    protected defaultAnswer = null;  // the base abstract class needs the field

    constructor(private config: ConfigurationService) {
        super();
    }

    ngOnInit(): void {
        this.angularClientBlock$ = this.getAngularClientBlock$();
    }

    protected buildFromDef(defBlock: ContentBlockDef): ActivityContentBlock {
        const angularBlock = new ActivityContentBlock();
        angularBlock.title = defBlock.titleTemplate ?
            new SimpleTemplate(defBlock.titleTemplate).getTranslationText(this.config.defaultLanguageCode) : null;
        // TODO handle templates properly!
        angularBlock.content = defBlock.bodyTemplate ?
            new SimpleTemplate(defBlock.bodyTemplate).getTranslationText(this.config.defaultLanguageCode) : null;
        return angularBlock;
    }
}
