export interface AdministrationUserRole {
  name: string;
  displayText: string;
  hasRole: boolean;
}

export interface AvailableRole {
  name: string;
  displayText: string;
}

export interface AvailableStudyRolesResponse {
  roles: AvailableRole[]
}
