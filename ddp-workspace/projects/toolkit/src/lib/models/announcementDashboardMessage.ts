// import { AnnouncementMessage } from 'ddp-sdk';
import {AnnouncementMessage} from "../../../../ddp-sdk/src/lib/models/announcementMessage";

export interface AnnouncementDashboardMessage extends AnnouncementMessage {
    shown: boolean;
}
