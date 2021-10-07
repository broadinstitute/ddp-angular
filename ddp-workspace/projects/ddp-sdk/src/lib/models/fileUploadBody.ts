export interface FileUploadBody {
    questionStableId: string;
    fileName: string;
    fileSize: number;
    mimeType?: string;
    resumable?: boolean;
}
