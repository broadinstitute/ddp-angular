export class ESFile {

  constructor( public bucket: string, public uploadedAt: string, public fileName: string, public mimeType: string,
               public scanResult: string, public fileSize: number, public blobName: string, public scannedAt: string, public guid: string) {
  }


  static parse( json ): ESFile {
    return new ESFile( json.bucket, json.uploadedAt, json.fileName, json.mimeType, json.scanResult, json.fileSize, json.blobName,
      json.scannedAt, json.guid );
  }
}
