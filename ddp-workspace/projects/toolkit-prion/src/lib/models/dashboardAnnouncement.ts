import { AnnouncementMessage } from 'ddp-sdk';

export interface DashboardAnnouncement extends AnnouncementMessage {
    shown: boolean;
}
