export class UmbrellaConfig {

  constructor (public umbrellaName:string,public apiVersion:string,public baseUrl:string) {}

  public getBaseUrl() {
    return this.baseUrl + "/" + this.umbrellaName + "/" + this.apiVersion;
  }

}
