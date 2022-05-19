export const topNavItems = [
  {name: 'Home', route: 'home', img: ''},
  {name: 'Patients', route: 'patients', img: ''},
  {name: 'Reporting', route: '', img: ''},
  {name: 'Administration', route: '', img: ''}
];

export const bottomNavItems = (userName: string): any[] =>
  [
    {name: userName, route: '', img: ''},
    {name: 'Sign out', img: '', signOut: true},
    {name: 'Help', route: '', img: ''}
  ];
