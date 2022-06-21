export const topNavItems = [
  {name: 'Home', route: '/fon', img: 'home'},
  {name: 'Patients', route: 'patients', img: 'group'},
  {name: 'Reporting', route: 'reporting', img: 'show_chart'},
  {name: 'Administration', route: 'administration', img: 'settings'}
];

export const bottomNavItems = (userName: string): any[] =>
  [
    {name: userName, route: '', img: 'person'},
    {name: 'Sign out', img: 'logout', signOut: true},
    {name: 'Help', route: '', img: 'help'}
  ];
