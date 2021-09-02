import { LoggingService, MailAddressBlock } from 'ddp-sdk';
import { ActivityComponentConverter } from './activityComponentConverter.service';
import { ComponentType } from '../../models/activity/componentType';

let service: ActivityComponentConverter;
const loggerServiceSpy: jasmine.SpyObj<LoggingService> = jasmine.createSpyObj('LoggingService', ['logError']);
const block = {
    component: {
        componentType: ComponentType.MailingAddress,
        parameters: {
            titleText: 'Title test',
            subtitleText: 'Subtitle test',
            requireVerified: true,
            requirePhone: false,
        },
        addressGuid: 'ABC123'
    },
    displayNumber: 1,
};

describe('ActivityComponentConverter Test', () => {
    beforeEach(() => {
        service = new ActivityComponentConverter(loggerServiceSpy);
    });

    it('should initialize service', () => {
        expect(service).toBeDefined();
    });

    it('should convert MailAddressBlock correctly', () => {
        expect(service.convertComponent(block) as MailAddressBlock).toEqual(jasmine.objectContaining({
            titleText: 'Title test',
            subtitleText: 'Subtitle test',
            requireVerified: true,
            requirePhone: false,
            addressGuid: 'ABC123',
            displayNumber: 1
        }));
    });
});
