export interface Role {
  name: string;
  displayText: string;
  hasRole: boolean;
}

export interface EditUserRoles {
  users: string[];
  roles: string[];
}

export interface AvailableRole {
  name: string;
  displayText: string;
}

export interface AvailableStudyRolesResponse {
  roles: AvailableRole[];
}
