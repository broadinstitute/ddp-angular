export class TissueSmId {
  isSelected = false;

  constructor(
    public smIdPk: string,
    public smIdType: string,
    public smIdValue: string,
    public tissueId: string,
    public deleted: boolean
  ) {}

  static parse( json ): TissueSmId {
    return new TissueSmId( json.smIdPk, json.smIdType, json.smIdValue, json.tissueId, false );
  }

  static parseArray( jsonArray: any[] ): any[] {
    const arr = [];
    if (jsonArray == null) {
      return arr;
    }
    jsonArray.forEach( ( val ) => {
      arr.push( this.parse( val ) );
    } );
    return arr;
  }
}
