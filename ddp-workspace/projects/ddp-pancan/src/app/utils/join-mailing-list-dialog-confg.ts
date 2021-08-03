import { NoopScrollStrategy } from '@angular/cdk/overlay';

export const JOIN_MAILING_LIST_DIALOG_SETTINGS = {
    width: '740px',
    position: { top: '30px' },
    data: {},
    autoFocus: false,
    scrollStrategy: new NoopScrollStrategy()
};
