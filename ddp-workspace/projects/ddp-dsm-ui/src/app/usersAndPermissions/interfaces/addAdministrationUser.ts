import {AdministrationUserRole} from "./administrationUserRole";
import {AdministrationUser} from "./administrationUser";

export interface AddAdministrationUserRequest {
  email: string;
  name: string;
  phone: string;
  roles: string[];
}

export interface AddAdministrationUserModal {
  availableRoles: Partial<AdministrationUserRole[]>,
  existingUsers: AdministrationUser[]
}
