export class File {

  constructor( public bucket: string, public uploadedAt: string, public fileName: string, public mimeType: string,
               public scanResult: string, public fileSize: number, public blobName: string, public scannedAt: string ) {
  }


  static parse( json ): File {
    return new File( json.bucket, json.uploadedAt, json.fileName, json.mimeType, json.scanResult, json.fileSize, json.blobName, json.scannedAt );
  }
}
