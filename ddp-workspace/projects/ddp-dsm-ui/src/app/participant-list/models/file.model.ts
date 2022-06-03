export class File {

  constructor( public bucket: string, public uploadedAt: string, public fileName: string, public mimeType: string,
               public scanResult: string, public fileSize: number, public blobName: string ) {
    this.bucket = bucket;
    this.uploadedAt = uploadedAt;
    this.fileName = fileName;
    this.mimeType = mimeType;
    this.scanResult = scanResult;
    this.fileSize = fileSize;
    this.blobName = blobName;
  }


  static parse( json ): File {
    return new File( json.bucket, json.uploadedAt, json.fileName, json.mimeType, json.scanResult, json.fileSize, json.blobName );
  }
}
