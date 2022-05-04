export class User {
  constructor( public email: string, public firstName: string, public lastName: string, public phoneNumber: string, public userId: number ) {
    this.phoneNumber = phoneNumber;
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.userId = userId;
  }

  static parse( json ): User {
    return new User( json.email, json.firstName, json.lastName, json.phoneNumber, json.userId );
  }
}
