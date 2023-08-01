import {Role} from './role';

export interface User {
  email: string;
  name: string;
  phone: string;
  roles: Role[];
}

export interface AdministrationUsersResponse {
  users: User[];
}
