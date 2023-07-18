import {AdministrationUser} from "./administrationUser";

export interface AdministrationUserRole {
  roleGuid: string;
  name: string;
  isSelected: boolean;
}

export interface AdministrationUserRolesResponse {
  userRoles: AdministrationUser[];
}
