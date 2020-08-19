import { Injectable } from '@angular/core';
import { LoggingService } from '../logging.service';
import { MailAddressBlock } from '../../models/activity/MailAddressBlock';
import { ActivityInstitutionBlock } from '../../models/activity/activityInstitutionBlock';
import { ActivityBlock } from '../../models/activity/activityBlock';

@Injectable()
export class ActivityComponentConverter {
    constructor(private logger: LoggingService) { }

    public convertComponent(inputBlock: any): ActivityBlock | null {
        if (inputBlock.component.componentType === 'MAILING_ADDRESS') {
            return this.buildMailAddressComponent(inputBlock);
        } else if (inputBlock.component.componentType === 'PHYSICIAN' ||
            inputBlock.component.componentType === 'INSTITUTION') {
            return this.buildInstitutionComponent(inputBlock);
        } else {
            this.logger.logError(
                `ActivityConverter.ActivityComponentConverter`,
                `Received component of type ${inputBlock.component.componentType} that we do not know how to handle`);
        }
        return null;
    }

    private buildMailAddressComponent(inputBlock: any): MailAddressBlock {
        const block = new MailAddressBlock(inputBlock.displayNumber);
        block.titleText = inputBlock.component.parameters.titleText;
        block.subtitleText = inputBlock.component.parameters.subtitleText;
        block.requireVerified = !!inputBlock.component.parameters.requireVerified;
        block.requirePhone = !!inputBlock.component.parameters.requirePhone;
        return block;
    }

    private buildInstitutionComponent(inputBlock: any): ActivityInstitutionBlock {
        const institutionBlock = new ActivityInstitutionBlock();
        institutionBlock.allowMultiple = inputBlock.component.parameters.allowMultiple;
        institutionBlock.addButtonText = inputBlock.component.parameters.addButtonText;
        institutionBlock.titleText = inputBlock.component.parameters.titleText;
        institutionBlock.subtitleText = inputBlock.component.parameters.subtitleText;
        institutionBlock.institutionType = inputBlock.component.parameters.institutionType;
        institutionBlock.showFieldsInitially = inputBlock.component.parameters.showFieldsInitially;
        institutionBlock.required = inputBlock.component.parameters.required;
        institutionBlock.displayNumber = inputBlock.displayNumber;
        return institutionBlock;
    }
}
