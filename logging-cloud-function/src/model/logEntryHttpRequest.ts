export interface LogEntryHttpRequest {
    requestUrl?: string;
    requestMethod?: string;
    userAgent?: string;
}
export function isLogEntryHttpRequest(data: any): data is LogEntryHttpRequest {
    return typeof data.requestUrl  === 'string' ||
        typeof data.requestMethod === 'string' ||
        typeof data.userAgent === 'string';
}
