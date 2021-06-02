import { FileUploadResponse } from './fileUploadResponse';

export interface UploadFile extends FileUploadResponse {
    file: File;
}
