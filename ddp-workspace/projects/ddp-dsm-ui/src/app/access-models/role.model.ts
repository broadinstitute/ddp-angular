export class Role {
  constructor( public roleId: number, public name: string, public description: string, public umbrellaId: number ) {
    this.name = name;
    this.roleId = roleId;
    this.description = description;
    this.umbrellaId = umbrellaId;
  }

  static parse( json ): Role {
    console.log( json );
    return new Role( json.roleId, json.name, json.description, json.umbrellaId );
  }
}
