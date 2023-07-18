import {AdministrationUserRole} from "./administrationUserRole";

export interface AdministrationUser {
  email: string;
  name: string;
  phone: string;
  roles: AdministrationUserRole[];
}
