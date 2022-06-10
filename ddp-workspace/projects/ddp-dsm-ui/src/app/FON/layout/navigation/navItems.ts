export const topNavItems = [
  { name: 'Home', route: 'home', img: 'home' },
  { name: 'Patients', route: 'patients', img: 'group' },
  { name: 'Reporting', route: '', img: 'show_chart' },
  { name: 'Administration', route: '', img: 'settings' },
];

export const bottomNavItems = (userName: string): any[] =>
  [
    {name: userName, route: '', img: 'person'},
    {name: 'Sign out', img: 'logout', signOut: true},
    {name: 'Help', route: '', img: 'help'}
  ];
