import { AnnouncementMessage } from 'ddp-sdk';

export interface AnnouncementDashboardMessage extends AnnouncementMessage {
    shown: boolean;
}
