export class KitType {
  selected = false;

  constructor(public kitId: number, public name: string, public displayName: string,
              public manualSentTrack: boolean, public externalShipper: boolean, public uploadReasons: Array<string>
  ) {}

  static parse(json): KitType {
    let jsonData: any[];
    const uploadReasons: Array<string> = [];
    if (json.uploadReasons != null) {
      jsonData = json.uploadReasons;
      jsonData.forEach((val) => {
        uploadReasons.push(val);
      });
    }
    return new KitType(json.kitId, json.name, json.displayName, json.manualSentTrack, json.externalShipper, uploadReasons);
  }
}
