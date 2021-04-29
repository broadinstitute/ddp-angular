export interface FileUploadBody {
    questionStableId: string;
    fileName: string;
    fileSize: number;
    mimeType?: string;
    resumable: boolean;
}

export interface FileUploadResponse {
    uploadGuid: string;
    uploadUrl: string;
}


