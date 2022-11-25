export interface IOnLineSnackbarModel {
   readonly online: boolean;
   readonly text: OnLineSnackbarMessages;
}

export enum OnLineSnackbarMessages {
  ONLINE = 'You are back online',
  OFFLINE = 'You are offline',
  OFFLINE_REQUEST = 'You can not request data while you are offline',
}
