import { Injectable } from '@angular/core';
import { LoggingService } from '../logging.service';
import { MailAddressBlock } from '../../models/activity/MailAddressBlock';
import { ActivityInstitutionBlock } from '../../models/activity/activityInstitutionBlock';
import { ActivityBlock } from '../../models/activity/activityBlock';
import { ComponentType } from '../../models/activity/componentType';

@Injectable()
export class ActivityComponentConverter {
    private readonly LOG_SOURCE = 'ActivityComponentConverter';

    constructor(private logger: LoggingService) { }

    public convertComponent(inputBlock: any): ActivityBlock | null {
        if (inputBlock.component.componentType === ComponentType.MailingAddress) {
            return this.buildMailAddressComponent(inputBlock);
        } else if ([ComponentType.Physician, ComponentType.Institution].includes(inputBlock.component.componentType)) {
            return this.buildInstitutionComponent(inputBlock);
        } else {
            this.logger.logError(this.LOG_SOURCE,
                `Received component of type ${inputBlock.component.componentType} that we do not know how to handle`);
        }
        return null;
    }

    private buildMailAddressComponent(inputBlock: any): MailAddressBlock {
        const params = inputBlock.component.parameters;
        const block = new MailAddressBlock(inputBlock.displayNumber);
        block.titleText = params.titleText;
        block.subtitleText = params.subtitleText;
        block.requireVerified = !!params.requireVerified;
        block.requirePhone = !!params.requirePhone;
        block.addressGuid = inputBlock.component.addressGuid;
        return block;
    }

    private buildInstitutionComponent(inputBlock: any): ActivityInstitutionBlock {
        const params = inputBlock.component.parameters;
        const institutionBlock = new ActivityInstitutionBlock();
        institutionBlock.allowMultiple = params.allowMultiple;
        institutionBlock.addButtonText = params.addButtonText;
        institutionBlock.titleText = params.titleText;
        institutionBlock.subtitleText = params.subtitleText;
        institutionBlock.institutionType = params.institutionType;
        institutionBlock.showFieldsInitially = params.showFieldsInitially;
        institutionBlock.required = params.required;
        institutionBlock.displayNumber = inputBlock.displayNumber;
        return institutionBlock;
    }
}
