import {AdministrationUserRole} from "./AdministrationUserRole";

export interface AdministrationUser {
  email: string;
  name: string;
  phone: string;
  roles: AdministrationUserRole[];
}
