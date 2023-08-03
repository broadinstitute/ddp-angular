import {Role} from './role';
import {User} from './user';

export interface AddUser {
  email: string;
  name: string;
  phone: string;
  roles: string[];
}

export interface AddUsersRequest {
  addUsers: AddUser[];
}

export interface RemoveUsersRequest {
  removeUsers: string[]; // users emails
}

export interface AddUserModal {
  availableRoles: Partial<Role[]>;
  existingUsers: User[];
}
