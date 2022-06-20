export interface KitTypeModel {
  kitId: number;
  name: string;
  displayName: string;
  manualSentTrack: boolean;
  externalShipper: boolean;
  uploadReasons: string[];
}
