export type NavigationItems = {
  [s in 'selectStudy' | 'samples' | 'study' | 'miscellaneous' | 'userSettings' | 'logOut']: Map<string, object>;
};
