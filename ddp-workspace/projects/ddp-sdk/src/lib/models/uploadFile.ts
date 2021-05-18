import { FileUploadResponse } from './fileUploadResponse';

export interface UploadFile extends FileUploadResponse {
    name: string;
    size: number;
    isUploaded: boolean;
}
