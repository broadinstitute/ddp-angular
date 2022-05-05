import {Role} from './role.model';
import {User} from './user.model';

export class UserWithRole {
  constructor( public user: User, public role: Role ) {
    this.role = role;
    this.user = user;
  }

  static parse( json ): UserWithRole {
    const user = User.parse( json.user );
    const role = Role.parse( json.role );
    return new UserWithRole( user, role );
  }
}
